// More informations: https://resend.com/docs/send-with-supabase-edge-functions

import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = "http://localhost:3000";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*'
};

interface RequestBody {
  email: string;
  role: string;
  projectId: string;
  projectName: string;
  invitationToken: string
}

const handler = async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await request.json() as RequestBody;

    const { email, role, projectId, invitationToken, projectName } = body;

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
        subject: `Invitation to join ${projectName}`,
        html: `
          <h2>You've been invited to join ${projectName}</h2>
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
    
    return new Response(JSON.stringify({ success: true, emailData }), {
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