import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_KEY
const APP_URL = "http://localhost:3000";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*'
};

const generateInvitationToken = (): string => {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

interface RequestBody {
  email: string;
  role: string;
  projectId: string;
}

const handler = async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Log request body for debugging
    const body = await request.json() as RequestBody;
    console.log('Request body:', body);

    const { email, role, projectId } = body;

    // Create invitation record
    const invitationToken = generateInvitationToken();
    const { data: invitation, error: invitationError } = await supabase
      .from('Invitations')
      .insert([
        {
          project_id: projectId,
          email,
          role,
          token: invitationToken,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])
      .select()
      .single();

    if (invitationError) {
      console.error('Supabase invitation error:', invitationError);
      throw new Error(`Failed to create invitation: ${invitationError.message}`);
    }

    // Get project details // TODO: Fix project_name
    const { data: project, error: projectError } = await supabase
      .from('Projects')
      .select('project_name')
      .eq('id', projectId)

      if (projectError) {
        console.error('Error fetching project:', projectError);
      } else if (!project) {
        console.warn('No project found for ID:', projectId);
      } else {
        console.log('Project data:', project);
      }

    if (!project) {
      throw new Error(`Project not found with ID: ${projectId}`);
    }

    // Send invitation email
    const acceptanceUrl = `${APP_URL}/invitation?token=${invitationToken}`;
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'hello@kevinschaerer.com',
        to: [email],
        subject: `Invitation to join ${project.project_name}`,
        html: `
          <h2>You've been invited to join ${projectId} ${project.project_name}</h2>
          <p>You've been invited to join the project with the role of ${role}.</p>
          <p>Click the button below to accept the invitation:</p>
          <a href="${acceptanceUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Accept Invitation
          </a>
          <p>This invitation will expire in 7 days.</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        `
      })
    });

    const emailData = await res.json();
    
    if (!res.ok) {
      console.error('Resend API error:', emailData);
      throw new Error(`Failed to send email: ${JSON.stringify(emailData)}`);
    }
    
    return new Response(JSON.stringify({ success: true, invitation, emailData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'An unknown error occurred'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);