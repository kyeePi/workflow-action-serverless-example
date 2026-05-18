# Workflow Action Serverless Example

Example HubSpot app for custom workflow action execution functions.

## What it demonstrates

- `PRE_ACTION_EXECUTION`: selects the endpoint URL and transforms the workflow execution payload before HubSpot sends it.
- `POST_ACTION_EXECUTION`: transforms the endpoint response into workflow output fields.
- `external` mode: sends the transformed payload to an AWS Lambda URL or API Gateway URL.
- `public` mode: sends the transformed payload to a public serverless endpoint. This requires Content Hub Enterprise.

## Files

- `src/app/workflow-actions/workflow-actions-hsmeta.json`: custom workflow action definition.
- `src/app/functions/WorkflowActionPublicEndpoint.js`: HubSpot public app function endpoint.
- `src/app/functions/workflow-action-public-hsmeta.json`: endpoint config for `/hs/serverless/workflow-action/public`.
- `examples/aws-lambda/workflow-action-external-handler.mjs`: AWS Lambda handler that mirrors the HubSpot endpoint response.

## Endpoint URLs

- External Lambda mode: paste your Lambda function URL or API Gateway URL into `External Lambda endpoint URL`.
- Public mode: after upload, use `https://<connected-domain>/hs/serverless/workflow-action/public`.

## AWS Lambda setup

- Runtime: Node.js 24.x.
- File: paste `examples/aws-lambda/workflow-action-external-handler.mjs` into `index.mjs`.
- Handler: `index.handler`.
- The example uses ES modules because the Lambda console creates `index.mjs` for Node.js 24.x.

## License requirement

- Public app function endpoints require Content Hub Enterprise.
- The workflow field description and help text state this requirement in the HubSpot workflow editor.

## Run

```sh
hs project upload
```

The action is unpublished by default. Set `isPublished` to `true` after testing.
