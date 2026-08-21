import type { APIGatewayProxyResult } from "aws-lambda";
import type { ApiResponse } from "../shared/types";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
};

export function response<T>(statusCode: number, body: ApiResponse<T>): APIGatewayProxyResult {
  return { statusCode, headers, body: JSON.stringify(body) };
}

export function ok<T>(data: T): APIGatewayProxyResult {
  return response(200, { data, error: null });
}

export function failure(statusCode: number, message: string): APIGatewayProxyResult {
  return response(statusCode, { data: null, error: { message } });
}
