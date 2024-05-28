import { Feedback } from '../../models/feedback';

export type FeedbackDTO = Omit<Feedback, 'id'>;

export interface ICreateFeedback {
  create(feedbackDTO: FeedbackDTO): Promise<void>;
}
