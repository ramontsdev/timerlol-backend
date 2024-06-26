import fs from 'node:fs';
import path from 'node:path';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IFindUserById } from "../../../domain/use-cases/user/find-user-by-id";
import { prismaClient } from '../../../infra/database/postgresDb';
import { DbFindUserById } from "../../../infra/database/repositories/user/DbFindUserById";
import { badRequest, forbidden, ok, serverError, unauthorized } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class UploadLogo implements IController {
  constructor(
    private readonly findUserByIdRepository: IFindUserById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      if (!accountId) {
        return unauthorized();
      }

      const user = await this.findUserByIdRepository.findById(accountId);
      if (!user) {
        return badRequest({ error: 'Invalid user id' })
      }

      if (user.subscription?.status !== 'active') {
        return forbidden({ error: 'Subscription not active.' })
      }

      if (!httpRequest.file) {
        return badRequest({ error: 'Image is required' });
      }

      const logoAlreadyExists = await prismaClient.logo.findFirst({
        where: { userId: user.id, }
      })

      if (logoAlreadyExists) {
        await DeleteFile.execute(logoAlreadyExists.filename);
        const logo = await prismaClient.logo.update({
          where: { id: logoAlreadyExists.id },
          data: {
            filename: httpRequest.file.filename
          }
        });
        await UploadFileService.execute(httpRequest.file.filename);

        return ok({
          ...logo,
          url: `${process.env.AWS_BUCKET_URL}/${logo.filename}`
        });
      }

      const logo = await prismaClient.logo.create({
        data: {
          filename: httpRequest.file.filename,
          userId: user.id,
        }
      });
      await UploadFileService.execute(httpRequest.file.filename);

      return ok({
        ...logo,
        url: `${process.env.AWS_BUCKET_URL}/${logo.filename}`
      });
    } catch (err) {
      const error = err as Error;

      console.log({ error: error.message })
      return serverError(error.message);
    };
  }
}

const dbFindUserById = new DbFindUserById();
export const uploadLogo = new UploadLogo(dbFindUserById);

export class UploadFileService {
  static async execute(filename: string) {
    const tmpPath = path.resolve('tmp', filename);
    try {
      const fileContent = await fs.promises.readFile(tmpPath);

      const s3Client = new S3Client({
        region: process.env.AWS_REGION,
      });

      const putObjectCommand = new PutObjectCommand({
        Bucket: 'timer-lol-bucket-12345',
        ACL: 'public-read',
        Body: fileContent,
        Key: filename
      });

      const response = await s3Client.send(putObjectCommand);

      await fs.promises.unlink(tmpPath);

      return response;
    } catch (err) {
      const error = err as Error;

      await fs.promises.unlink(tmpPath);

      throw error;
    };
  }
}

class DeleteFile {
  static async execute(filename: string) {
    try {
      const s3Client = new S3Client({
        region: process.env.AWS_REGION,
      });

      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: 'timer-lol-bucket-12345',
        Key: filename
      });

      const response = await s3Client.send(deleteObjectCommand);

      return response;
    } catch (err) {
      const error = err as Error;

      throw error;
    };
  }
}
