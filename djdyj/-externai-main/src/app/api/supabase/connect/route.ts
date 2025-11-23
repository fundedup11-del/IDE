import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * POST /api/supabase/connect
 * 
 * Initiates Supabase CLI authentication flow.
 * 
 * Flow:
 * 1. Check if Supabase CLI is installed
 * 2. Run `supabase login` to open browser for authentication
 * 3. Return success/error status
 */
export async function POST(request: NextRequest) {
    try {
        // Check if Supabase CLI is installed
        try {
            const { stdout: versionOutput } = await execAsync('supabase --version');
            console.log('Supabase CLI version:', versionOutput.trim());
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'SUPABASE_CLI_NOT_INSTALLED',
                    message: 'Supabase CLI is not installed. Please install it first.',
                    installInstructions: {
                        windows: 'scoop install supabase',
                        mac: 'brew install supabase/tap/supabase',
                        linux: 'npm install -g supabase',
                    },
                },
                { status: 400 }
            );
        }

        // Check if already logged in
        try {
            const { stdout: statusOutput } = await execAsync('supabase status');

            // If the command succeeds, user might already be logged in
            // Try to get the access token
            const tokenMatch = statusOutput.match(/Access token: (.+)/);
            if (tokenMatch) {
                return NextResponse.json({
                    success: true,
                    alreadyLoggedIn: true,
                    message: 'Already logged in to Supabase',
                });
            }
        } catch {
            // Not logged in, proceed with login
        }

        // Initiate login flow
        // Note: This will open a browser window for the user
        const { stdout: loginOutput } = await execAsync('supabase login');

        console.log('Login output:', loginOutput);

        return NextResponse.json({
            success: true,
            message: 'Successfully authenticated with Supabase',
            output: loginOutput,
        });
    } catch (error: any) {
        console.error('Supabase connect error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'AUTHENTICATION_FAILED',
                message: error.message || 'Failed to authenticate with Supabase',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/supabase/connect
 * 
 * Check if user is currently authenticated with Supabase CLI
 */
export async function GET(request: NextRequest) {
    try {
        // Check if Supabase CLI is installed
        try {
            await execAsync('supabase --version');
        } catch {
            return NextResponse.json({
                installed: false,
                authenticated: false,
            });
        }

        // Check authentication status
        try {
            const { stdout } = await execAsync('supabase status');
            const isAuthenticated = stdout.includes('Access token:');

            return NextResponse.json({
                installed: true,
                authenticated: isAuthenticated,
            });
        } catch {
            return NextResponse.json({
                installed: true,
                authenticated: false,
            });
        }
    } catch (error: any) {
        return NextResponse.json(
            {
                installed: false,
                authenticated: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
