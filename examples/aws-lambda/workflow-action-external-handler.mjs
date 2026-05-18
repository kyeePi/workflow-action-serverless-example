function parseBody(event) {
  if (!event || !event.body) {
    return {};
  }

  if (typeof event.body === 'object') {
    return event.body;
  }

  try {
    return JSON.parse(event.body);
  } catch (error) {
    return { rawBody: event.body };
  }
}

function buildResponse(payload, endpointUsed) {
  const object = payload.enrolledObject || {};
  const objectType = object.objectType || 'unknown object';
  const objectId = object.objectId || 'unknown id';
  const message = payload.message || '';

  return {
    success: true,
    status: 'ok',
    mode: payload.mode || 'external',
    endpointUsed,
    correlationId: payload.correlationId || '',
    transformedMessage: `[${endpointUsed}] ${message}`.trim(),
    requestSummary: `Received ${objectType} ${objectId}`,
    receivedPayload: {
      source: payload.source,
      workflowId:
        payload.workflow && payload.workflow.context
          ? payload.workflow.context.workflowId
          : undefined,
      callbackId: payload.workflow ? payload.workflow.callbackId : undefined,
    },
  };
}

export const handler = async (event) => {
  const payload = parseBody(event);

  if (!payload.message) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        status: 'error',
        mode: payload.mode || 'external',
        endpointUsed: 'external',
        correlationId: payload.correlationId || '',
        error: 'missing_message',
        requestSummary: 'Request body must include message.',
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildResponse(payload, 'external')),
  };
};
