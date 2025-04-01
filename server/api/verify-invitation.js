// More informations: https://supabase.nuxtjs.org/usage/services/serversupabaseclient

import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  const body = await readBody(event);
  const token = body.token;

  // Validate token
  if (!body || !body.token || !token) {
    console.error("No token provided.");
    return {
      error: "No token provided",
      code: "NO_TOKEN",
    };
  }

  try {
    // Check if user is authenticated
    if (!user) {
      console.error("User authentication failed");
      return {
        error: "User authentication failed",
        details: userError.message,
      };
    }

    // Get id of profile table
    const { data: profile } = await client
      .from("Profiles")
      .select("id, email")
      .eq("user_id", user.id);

    // Get all columns of invitation table
    const { data: invitation } = await client
      .from("Invitations")
      .select("*")
      .eq("token", token);

    const { data: existingMember } = await client
      .from("Members")
      .select("*")
      .eq("project_id", invitation[0].project_id)
      .eq("user_id", profile[0].id);

    // Check if email is matching
    if (invitation[0].email !== profile[0].email) {
      console.log(
        "The email in the invitation does not match the authorized email."
      );
      return {
        error: "Email mismatch",
        code: "EMAIL_MISMATCH",
      };
    }

    // Check if invitation is already used
    if (invitation[0].status !== "pending") {
      console.log("Invitation already used");
      return;
    }

    // Check if user is already member
    if (existingMember.length > 0) {
      await client
        .from("Invitations")
        .update({
          status: "already_member",
        })
        .eq("token", token);

      console.log("Already a member of this project");
      return {
        error: "Already a member of this project",
        code: "ALREADY_MEMBER",
      };
    }

    // Update invitation status and add date
    const { error: updateError } = await client
      .from("Invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("token", token);

    if (updateError) {
      console.log("Failed to update invitation");
      return {
        error: "Failed to update invitation",
        code: "UPDATE_FAILED",
      };
    }

    // Add user to member table
    const { error: createError } = await client.from("Members").insert({
      project_id: invitation[0].project_id,
      user_id: profile[0].id,
      role: invitation[0].role,
      created_at: new Date().toISOString(),
    });

    // Revert invitation status in case of error
    if (createError) {
      console.log("Data reverted due to error");

      await client
        .from("Invitations")
        .update({
          status: "pending",
          accepted_at: null,
        })
        .eq("token", token);

      return {
        error: "Failed to create membership",
        code: "MEMBERSHIP_FAILED",
      };
    }

    return {
      success: true,
      projectId: invitation.project_id,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      error: "An unexpected error occurred",
      code: "UNEXPECTED_ERROR",
    };
  }
});
