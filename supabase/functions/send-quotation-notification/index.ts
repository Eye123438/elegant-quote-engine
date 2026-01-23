import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuotationRequest {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceId: string;
  serviceName: string;
  notes?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: QuotationRequest = await req.json();
    const { fullName, email, phone, companyName, serviceId, serviceName, notes } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !serviceId || !serviceName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store the quotation request in database
    const { data, error: dbError } = await supabase
      .from("quotation_requests")
      .insert([{
        full_name: fullName,
        email: email,
        phone: phone,
        company_name: companyName || null,
        service_id: serviceId,
        service_name: serviceName,
        notes: notes || null,
        status: "pending"
      }])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save quotation request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the notification (email sending would go here with Resend when configured)
    console.log("New quotation request received:", {
      id: data.id,
      client: fullName,
      email: email,
      phone: phone,
      service: serviceName,
      timestamp: new Date().toISOString()
    });

    // Return success with the created record ID
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Quotation request submitted successfully",
        requestId: data.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing quotation:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
