function getBody(context) {
  if (!context || !context.body) {
    return {};
  }

  if (typeof context.body === 'string') {
    try {
      return JSON.parse(context.body);
    } catch (error) {
      return { rawBody: context.body };
    }
  }

  return context.body;
}

function buildResponse(payload, endpointUsed) {
  const object = payload.enrolledObject || {};
  const objectType = object.objectType || 'unknown object';
  const objectId = object.objectId || 'unknown id';
  const message = payload.message || '';

  return {
    success: true,
    status: 'ok',
    mode: payload.mode || 'public',
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

exports.main = async (context) => {
  const payload = getBody(context);

  if (!payload.message) {
    return {
      statusCode: 400,
      body: {
        success: false,
        status: 'error',
        mode: payload.mode || 'public',
        endpointUsed: 'public',
        correlationId: payload.correlationId || '',
        error: 'missing_message',
        requestSummary: 'Request body must include message.',
      },
    };
  }

  return {
    statusCode: 200,
    body: buildResponse(payload, 'public'),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
