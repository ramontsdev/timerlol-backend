import type { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  const code = event.request.codeParameter;
  const { name } = event.request.userAttributes;
  // eslint-disable-next-line prefer-destructuring
  const email = event.request.userAttributes.email;

  const response = { ...event.response };

  if (event.triggerSource === 'CustomMessage_SignUp') {
    response.emailSubject = `Bem vindo(a) ${name}!`;
    response.emailMessage = `
      <h1>
        Seja muito bem-vindo(a) ${name}
      </h1>
      <br /><br />
      <h4>
        Use este código para confirmar sua conta:
      </h4>
      <h5>${code}</h5>
    `;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    response.emailSubject = 'Recuperação de conta';
    response.emailMessage = `
      <h2>
        Para recuperar sua conta use este código:
      </h2>
      <strong>
        ${code}
      </strong>
    `;
  }

  if (event.triggerSource === 'CustomMessage_ResendCode') {
    response.emailSubject = 'Código de confirmação';
    response.emailMessage = `
        <h4>
        Use este código para confirmar sua conta:
        </h4>
        <h5>${code}</h5>
    `;
  }

  return { ...event, response };
}
