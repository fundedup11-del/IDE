/**
 * API Response Types
 * Type definitions for both single-file and multi-file API responses
 */

import { ProjectType, ProjectConfig } from './file-tree-generator';

/**
 * Single-file response (original format)
 */
export interface SingleFileResponse {
    message: string;
    code: string;
    language: string;
    observerInsights: string | null;
    imageValidation: string | null;
}

/**
 * Multi-file response (new format)
 */
export interface MultiFileResponse {
    message: string;
    fileTree: Record<string, string>; // path -> content
    projectType: ProjectType;
    projectConfig: ProjectConfig;
    observerInsights: string | null;
    imageValidation: string | null;
}

/**
 * Union type for all API responses
 */
export type ChatApiResponse = SingleFileResponse | MultiFileResponse;

/**
 * Type guard to check if response is multi-file
 */
export function isMultiFileResponse(
    response: ChatApiResponse
): response is MultiFileResponse {
    return 'fileTree' in response;
}

/**
 * Type guard to check if response is single-file
 */
export function isSingleFileResponse(
    response: ChatApiResponse
): response is SingleFileResponse {
    return 'code' in response;
}
