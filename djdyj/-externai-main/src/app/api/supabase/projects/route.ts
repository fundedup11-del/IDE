import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * GET /api/supabase/projects
 * 
 * Fetches the list of Supabase projects for the authenticated user.
 * 
 * Uses Supabase Management API to retrieve projects.
 * Requires user to be authenticated via Supabase CLI.
 */
export async function GET(request: NextRequest) {
    try {
        // First, verify that user is authenticated
        try {
            await execAsync('supabase --version');
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    error: 'SUPABASE_CLI_NOT_INSTALLED',
                    message: 'Supabase CLI is not installed',
                },
                { status: 400 }
            );
        }

        // Get the access token from Supabase CLI
        let accessToken: string | null = null;

        try {
            // The token is stored in the Supabase CLI config
            // We need to get it via the link command or by reading the config
            const { stdout } = await execAsync('supabase projects list --output json');

            // Parse the JSON output
            const projects = JSON.parse(stdout);

            // Transform projects to include necessary information
            const transformedProjects = projects.map((project: any) => ({
                id: project.id,
                name: project.name,
                organizationId: project.organization_id,
                region: project.region,
                createdAt: project.created_at,
                // We'll need to fetch these separately if needed
                database: {
                    host: `db.${project.ref}.supabase.co`,
                    port: 5432,
                },
                apiUrl: `https://${project.ref}.supabase.co`,
                // The anon key and service role key need to be fetched separately
            }));

            return NextResponse.json({
                success: true,
                projects: transformedProjects,
            });
        } catch (error: any) {
            // If the command fails, user might not be authenticated
            if (error.message.includes('not logged in') || error.message.includes('unauthorized')) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'NOT_AUTHENTICATED',
                        message: 'Please authenticate with Supabase first',
                    },
                    { status: 401 }
                );
            }

            throw error;
        }
    } catch (error: any) {
        console.error('Failed to fetch Supabase projects:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'FETCH_PROJECTS_FAILED',
                message: error.message || 'Failed to fetch projects from Supabase',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/supabase/projects/[projectId]
 * 
 * Fetches detailed information for a specific project, including API keys.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectRef } = body;

        if (!projectRef) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'MISSING_PROJECT_REF',
                    message: 'Project reference is required',
                },
                { status: 400 }
            );
        }

        // Get project details including API keys
        try {
            const { stdout } = await execAsync(`supabase projects api-keys --project-ref ${projectRef} --output json`);
            const apiKeys = JSON.parse(stdout);

            return NextResponse.json({
                success: true,
                apiKeys: {
                    anon: apiKeys.anon,
                    serviceRole: apiKeys.service_role,
                },
                apiUrl: `https://${projectRef}.supabase.co`,
            });
        } catch (error: any) {
            throw new Error(`Failed to fetch API keys: ${error.message}`);
        }
    } catch (error: any) {
        console.error('Failed to fetch project details:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'FETCH_PROJECT_DETAILS_FAILED',
                message: error.message || 'Failed to fetch project details',
            },
            { status: 500 }
        );
    }
}
