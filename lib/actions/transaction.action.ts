"use server";

import Razorpay from "razorpay";
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transactions.model';
import { updateCredits } from './user.actions';
import { redirect } from 'next/navigation';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  const amount = Number(transaction.amount) * 100;

  // Create a Razorpay order
  const options = {
    amount,
    currency: "INR",
    receipt: `receipt_${transaction.buyerId}`,
  };

  const order = await razorpay.orders.create(options);

  // Save transaction to database
  await connectToDatabase();
  const newTransaction = await Transaction.create({
    ...transaction,
    buyer: transaction.buyerId,
    razorpayOrderId: order.id,
  });

  return {
    orderId: order.id,
    amount: amount,
    currency: "INR",
  };
}

export async function createTransaction(transaction: CreateTransactionParams) {
  await connectToDatabase();

  const newTransaction = await Transaction.create({
    ...transaction,
    buyer: transaction.buyerId,
  });

  await updateCredits(transaction.buyerId, transaction.credits);

  return JSON.parse(JSON.stringify(newTransaction));
}
