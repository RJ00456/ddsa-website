import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { fullName, phone, email, homeState, college, assistanceType, query } = data;

    // Server-side input validation
    if (!fullName || !phone || !email || !college || !query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All required fields must be filled.' })
      };
    }

    // Insert record into Supabase
    const { error } = await supabase.from('student_requests').insert([
      {
        full_name: fullName.trim(),
        phone_number: phone.trim(),
        email: email.trim().toLowerCase(),
        home_state: homeState,
        college_name: college.trim(),
        assistance_type: assistanceType,
        query_description: query.trim()
      }
    ]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Request submitted successfully!' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Internal Server Error' })
    };
  }
}
