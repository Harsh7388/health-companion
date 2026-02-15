import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const testUsers = [
      { email: "admin@meditrack.com", password: "Admin123!", name: "Admin User", age: 30, isAdmin: true },
      { email: "john@example.com", password: "Test1234!", name: "John Doe", age: 28 },
      { email: "jane@example.com", password: "Test1234!", name: "Jane Smith", age: 35 },
      { email: "mike@example.com", password: "Test1234!", name: "Mike Johnson", age: 42 },
      { email: "sarah@example.com", password: "Test1234!", name: "Sarah Wilson", age: 31 },
      { email: "chris@example.com", password: "Test1234!", name: "Chris Brown", age: 25 },
    ];

    const createdUsers: string[] = [];

    for (const u of testUsers) {
      // Check if user exists
      const { data: existing } = await admin.auth.admin.listUsers();
      const found = existing?.users?.find((eu: any) => eu.email === u.email);
      
      let userId: string;
      if (found) {
        userId = found.id;
      } else {
        const { data, error } = await admin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { name: u.name, age: u.age },
        });
        if (error) throw new Error(`Failed to create ${u.email}: ${error.message}`);
        userId = data.user.id;
      }

      // Update profile age
      await admin.from("profiles").update({ age: u.age }).eq("user_id", userId);

      // Add admin role if needed
      if (u.isAdmin) {
        const { data: existingRole } = await admin
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        if (!existingRole) {
          await admin.from("user_roles").insert({ user_id: userId, role: "admin" });
        }
      }

      createdUsers.push(userId);
    }

    // Seed medicines for non-admin users
    const medicines = [
      { name: "Metformin", dosage: "500mg", frequency: "twice_daily", time: "08:00" },
      { name: "Lisinopril", dosage: "10mg", frequency: "daily", time: "09:00" },
      { name: "Vitamin D", dosage: "1000IU", frequency: "daily", time: "08:00" },
      { name: "Aspirin", dosage: "81mg", frequency: "daily", time: "07:00" },
      { name: "Omega-3", dosage: "1000mg", frequency: "daily", time: "08:00" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "daily", time: "21:00" },
      { name: "Multivitamin", dosage: "1 tablet", frequency: "daily", time: "08:00" },
      { name: "Ibuprofen", dosage: "200mg", frequency: "as_needed", time: "12:00" },
    ];

    // Assign medicines to non-admin users (indices 1-5)
    for (let i = 1; i < createdUsers.length; i++) {
      const userId = createdUsers[i];
      // Check if user already has medicines
      const { data: existing } = await admin.from("medicines").select("id").eq("user_id", userId);
      if (existing && existing.length > 0) continue;

      const userMeds = medicines.slice(0, 2 + Math.floor(Math.random() * 4));
      const insertedMeds = [];
      for (const med of userMeds) {
        const { data } = await admin.from("medicines").insert({
          user_id: userId,
          ...med,
        }).select("id").single();
        if (data) insertedMeds.push(data.id);
      }

      // Create medicine logs for the past 7 days
      const statuses = ["taken", "taken", "taken", "missed", "taken"];
      for (const medId of insertedMeds) {
        for (let d = 0; d < 7; d++) {
          const date = new Date();
          date.setDate(date.getDate() - d);
          const dateStr = date.toISOString().split("T")[0];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          await admin.from("medicine_logs").insert({
            user_id: userId,
            medicine_id: medId,
            date: dateStr,
            time: "08:00",
            status,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Seed complete. Admin: admin@meditrack.com / Admin123!",
        usersCreated: createdUsers.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
