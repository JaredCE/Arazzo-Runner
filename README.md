# Arazzo-Runner

<p>
  <a href="https://www.npmjs.com/package/arazzo-runner">
    <img src="https://img.shields.io/npm/v/arazzo-runner.svg?style=flat-square">
  </a>
  <a href="https://github.com/JaredCE/arazzo-runner/actions/workflows/node.yml">
    <img src="https://github.com/JaredCE/arazzo-runner/actions/workflows/node.yml/badge.svg">
  </a>
  <a href="https://www.buymeacoffee.com/jarede">
    <img src="https://raw.githubusercontent.com/pachadotdev/buymeacoffee-badges/main/bmc-donate-yellow.svg">
  </a>
</p>

Run your [OpenAPI Arazzo Workflow Spec](https://www.openapis.org/arazzo-specification).

## Install

**Using npm:**

```bash
npm install -g arazzo-runner
```

## Use

```bash
# Run the CLI
arazzo-runner --arazzo ./arazzo.json --input ./input.json

# Or with short flags
arazzo-runner -a arazzo.json -i input.json

# With URL
arazzo-runner -a https://example.com/arazzo.json -i ./input.json

# Show help
arazzo-runner --help

# Show version
arazzo-runner --version
```

### Input file

The input file is where you keep your variables that you wish to use within your workflow and should be a json file structured like:

```json
{
  "worflowId1": {
    "name": "Jared"
  }
}
```

The file should contain objects for each workflow, by workflowId, with the variables matching up to the inputs that you defined in your workflow inputs schema.

This file is likely to be comitted to your repository, so you should not store secrets in the file, instead you might use something like [jq](https://jqlang.org/) that can take repository variables and insert them into your input file:

```bash
jq --arg password "$secret_password" '.workflowId1.password = $password' input.json
```

Obviously, if you have a lot of secret variables that need adding as inputs, then you might need to write a script that can alter the `input.json` file for you within your CI/CD runner.

## OpenAPI Servers

OpenAPI Documents allow you to specify servers at the root, [path](https://spec.openapis.org/oas/latest.html#path-item-object) and [operation](https://spec.openapis.org/oas/latest.html#operation-object) level. They allow you to specify multiple servers, however the OpenAPI specification is opinionated that all servers specified in a Document should return the same thing and this Arazzo Runner will follow this opinion and only attempt one of the specified servers.

This Arazzo Runner will pick the first server it comes across in the array of servers and run the operation against that.

- If the operation has servers specified, it will use the first server at the operation level, ignoring path and root servers.
- If the operation does not have a server specified, and the path level does, it will use the path level server, ignoring the root level
- If the operation only has servers specified at the root of the document, it will only use the first root level server.

It will attempt to map to the [Server Variables](https://spec.openapis.org/oas/latest.html#server-variable-object), using the `default` that is set.

## OpenAPI Parameters

OpenAPI Documents allow you to specify [`header`, `path` and `query` parameters](https://spec.openapis.org/oas/latest.html#parameter-object) in myriad of styles. This Arazzo Runner will respect your styling (unless you specify stylings for `Accept`, `Authorization` or `Content-Type` headers, then it will ignore the stylings, as per the OpenAPI specification) and send the format to the server as specified by your OpenAPI Document.

It currently does not follow the `allowEmptyValue`, `allowReserved` or the `content` keywords currently.

## OpenAPI Security

OpenAPI Document security is supported. There are a couple of ways that you will have to document your Arazzo Workflow for certain documentation types.

### Basic

For HTTP Basic authentication, you should document your Arazzo like:

**arazzo.json**

```json
"steps": [
  {
    "stepId": "deleteUser",
    "operationId": "deleteUser",
    "parameters": [
      {
        "name": "Authorization",
        "in": "header",
        "value": "{$inputs.username}:{$inputs.password}"
      },
      { "name": "username", "in": "path", "value": "$inputs.username" }
    ]
  }
]
```

The Runner will correctly encode and prepend `Basic` to the Authorization Header.

### Bearer

For HTTP Bearer authentication, you should document your Arazzo like:

**arazzo.json**

```json
{
  "stepId": "LoginExistingUser",
  "operationId": "loginUser",
  "requestBody": {
    "contentType": "application/json",
    "payload": {
      "username": "$inputs.username",
      "password": "$inputs.password"
    }
  },
  "outputs": { "AccessToken": "$response.body#/AccessToken" }
},
{
  "stepId": "deleteUser",
  "operationId": "deleteUser",
  "parameters": [
    {
      "name": "Authorization",
      "in": "header",
      "value": "$steps.LoginExistingUser.outputs.AccessToken"
    },
    { "name": "username", "in": "path", "value": "$inputs.username" }
  ]
}
```

The Runner will prepend `Bearer` for you.

### mutualTLS

> mutualTLS is quite a complex authorization topic. I have written a naive way of dealing with it that I am unsure will actually work in production. If you are using mutualTLS and this Arazzo Runner and find that you run into bugs/issues, please do feel free to opena. report. The more I know and understand mutualTLS the better I can support it.

You will need to provide inputs for your ClientKey and ClientCert as their path locations:

**input.json**

```json
{
  "deleteCurrentUser-mutualTLS": {
    "username": "jack",
    "key": "./client-key.pem",
    "cert": "./client-cert.pem"
  }
}
```

`key` and `cert` are reserved names when used in an OpenAPI Document with `mutualTLS` as the authentication method. The Runner will error out if they are not found.

### UNSUPPORTED oauth/openId

**CURRENTLY UNSUPPORTED**

You will need to provide inputs for your clientId and clientSecret:

**input.json**

```json
{
  "deleteCurrentUser-mutualTLS": {
    "username": "jack",
    "clientId": "abc123",
    "clientSecret": "123abc"
  }
}
```

`clientId` and `clientSecret` are reserved name and will be used when oauth or openId authentication is set.

## Logging And Reporting

### Logging

Logging is currently pretty verbose, with an example Log looking like:

```bash
Running Workflows
Running Workflow: createUser
Running Step: createAUser
Getting Source Description for: users-openAPI
Making a POST to http://petstore.swagger.io/v2/user
http://petstore.swagger.io/v2/user responded with a: 200
==================================================================================
Checking: $statusCode == 200
✅ $statusCode == 200 passed
==================================================================================
✅ All criteria checks passed
Running onSuccess Rules
✅ Step createAUser completed
✅ Workflow createUser completed
✅ All Workflows run
```

### Reporting

Work on Reporting still needs completeing.

## Still unsupported

### PathOperation

Accessing an OpenAPI operation by Operation Path `'{$sourceDescriptions.petstoreDescription.url}#/paths/~1pet~1findByStatus/get'` does not work currently

### JSONPath and XPath criteria objects

Criteria Objects set as type JSON Path or XPath do not work

### Non application/json Responses

Responses that do not conform to application/json do not work

### Non application/json Requests

Requests that do not conform to application/json do not work
