import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://fbcvxefvvifmxaiqxiuq.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV'
);

const UPDATES = [
  [201, 'result', 'SSC CGL Result', 'SSC CGL result update.'],
  [202, 'result', 'SSC CHSL Result', 'SSC CHSL result declared.'],
  [205, 'result', 'RRB NTPC Result', 'RRB NTPC result update.'],
  [207, 'result', 'SBI PO Result', 'SBI PO result update.'],
  [209, 'result', 'IBPS PO Result', 'IBPS PO result update.'],
  [211, 'result', 'UPSC CSE Update', 'UPSC CSE latest update.'],
  [213, 'result', 'JEE Main Update', 'JEE Main result update.'],
  [215, 'result', 'NEET UG Update', 'NEET UG result update.'],
  [205, 'admit_card', 'RRB NTPC Admit Card', 'RRB NTPC admit card released.'],
  [207, 'admit_card', 'SBI PO Admit Card', 'SBI PO admit card jari.'],
  [209, 'admit_card', 'IBPS PO Admit Card', 'IBPS PO admit card released.'],
  [211, 'admit_card', 'UPSC CSE Admit Card', 'UPSC CSE admit card available.'],
  [213, 'admit_card', 'JEE Main Admit Card', 'JEE Main admit card jari.'],
  [215, 'admit_card', 'NEET UG Admit Card', 'NEET UG admit card released.'],
  [201, 'notification', 'SSC New Notification', 'SSC naye vacancy notification.'],
  [205, 'notification', 'RRB New Notification', 'RRB naye recruitment.'],
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  if (secret !== 'sarkari123auto') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const selected = [...UPDATES].sort((a,b) => (a[0]*31+day)%100 - (b[0]*31+day)%100).slice(0, 6);
  let count = 0;

  for (const [eid, type, title, desc] of selected) {
    const { error } = await supabase.from('updates').insert({
      exam_id: eid, update_type: type,
      title: `${title} - ${today}`,
      description: desc, publish_date: today,
      is_verified: true,
    });
    if (!error) count++;
  }

  return Response.json({ success: true, date: today, updates: count });
}
