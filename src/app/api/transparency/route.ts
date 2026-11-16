import { NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      donationsCents: 0,
      salesCents: 0,
      stripeFeesCents: 0,
      expensesByCategory: {
        impostos: 0,
        infraestrutura: 0,
        eventos: 0,
        outros: 0,
      },
      totalExpensesCents: 0,
      netBalanceCents: 0,
      recentExpenses: [],
      recentTransactions: [],
    });
  }

  try {
    const txRows = await query<{
      kind: string;
      total_amount: string;
      total_fees: string;
    }>(
      `SELECT kind, COALESCE(SUM(amount_cents), 0) AS total_amount, COALESCE(SUM(fee_cents), 0) AS total_fees
       FROM stripe_transactions
       WHERE status = 'completed'
       GROUP BY kind`
    );

    let donationsCents = 0;
    let salesCents = 0;
    let stripeFeesCents = 0;

    for (const row of txRows) {
      const amt = Number(row.total_amount || 0);
      const fee = Number(row.total_fees || 0);
      stripeFeesCents += fee;
      if (row.kind === "donation") donationsCents += amt;
      if (row.kind === "store") salesCents += amt;
    }

    const expRows = await query<{ category: string; total_amount: string }>(
      `SELECT category, COALESCE(SUM(amount_cents), 0) AS total_amount
       FROM financial_expenses
       GROUP BY category`
    );

    const expensesByCategory: Record<string, number> = {
      impostos: 0,
      infraestrutura: 0,
      eventos: 0,
      outros: 0,
    };
    let totalExpensesCents = 0;

    for (const row of expRows) {
      const amt = Number(row.total_amount || 0);
      expensesByCategory[row.category] = (expensesByCategory[row.category] || 0) + amt;
      totalExpensesCents += amt;
    }

    const recentExpenses = await query(
      `SELECT id, category, description, amount_cents, reference_date
       FROM financial_expenses
       ORDER BY reference_date DESC, created_at DESC
       LIMIT 15`
    );

    const recentTransactions = await query(
      `SELECT id, kind, amount_cents, fee_cents, description, created_at
       FROM stripe_transactions
       WHERE status = 'completed'
       ORDER BY created_at DESC
       LIMIT 15`
    );

    const netBalanceCents = donationsCents + salesCents - stripeFeesCents - totalExpensesCents;

    return NextResponse.json({
      configured: true,
      donationsCents,
      salesCents,
      stripeFeesCents,
      expensesByCategory,
      totalExpensesCents,
      netBalanceCents,
      recentExpenses,
      recentTransactions,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao carregar transparência." }, { status: 500 });
  }
}
