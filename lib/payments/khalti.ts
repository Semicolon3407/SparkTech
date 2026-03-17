const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || '';
const KHALTI_API_URL = process.env.KHALTI_API_URL || 'https://dev.khalti.com/api/v2'; // Use dev for sandbox

interface KhaltiInitiateParams {
  returnUrl: string;
  websiteUrl: string;
  amount: number; // Amount in paisa (Rs. 100 = 10000 paisa)
  purchaseOrderId: string;
  purchaseOrderName: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  amountBreakdown?: {
    label: string;
    amount: number;
  }[];
  productDetails?: {
    identity: string;
    name: string;
    totalPrice: number;
    quantity: number;
    unitPrice: number;
  }[];
}

interface KhaltiInitiateResponse {
  success: boolean;
  pidx?: string;
  paymentUrl?: string;
  expiresAt?: string;
  message?: string;
}

interface KhaltiVerifyResponse {
  success: boolean;
  message: string;
  pidx?: string;
  totalAmount?: number;
  status?: string;
  transactionId?: string;
  fee?: number;
  refunded?: boolean;
}

/**
 * Initiate Khalti payment
 */
export async function initiateKhaltiPayment(
  params: KhaltiInitiateParams
): Promise<KhaltiInitiateResponse> {
  try {
    const response = await fetch(`${KHALTI_API_URL}/epayment/initiate/`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        return_url: params.returnUrl,
        website_url: params.websiteUrl,
        amount: params.amount,
        purchase_order_id: params.purchaseOrderId,
        purchase_order_name: params.purchaseOrderName,
        customer_info: params.customerInfo,
        amount_breakdown: params.amountBreakdown,
        product_details: params.productDetails,
      }),
    });

    const data = await response.json();

    if (response.ok && data.pidx) {
      return {
        success: true,
        pidx: data.pidx,
        paymentUrl: data.payment_url,
        expiresAt: data.expires_at,
      };
    }

    return {
      success: false,
      message: data.detail || data.message || 'Failed to initiate payment',
    };
  } catch (error) {
    console.error('Khalti initiation error:', error);
    return {
      success: false,
      message: 'Failed to initiate Khalti payment',
    };
  }
}

/**
 * Verify Khalti payment
 */
export async function verifyKhaltiPayment(pidx: string): Promise<KhaltiVerifyResponse> {
  try {
    const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();

    if (response.ok && data.status === 'Completed') {
      return {
        success: true,
        message: 'Payment verified successfully',
        pidx: data.pidx,
        totalAmount: data.total_amount / 100, // Convert paisa to rupees
        status: data.status,
        transactionId: data.transaction_id,
        fee: data.fee ? data.fee / 100 : 0,
        refunded: data.refunded,
      };
    }

    return {
      success: false,
      message: `Payment status: ${data.status}`,
      status: data.status,
      pidx: data.pidx,
    };
  } catch (error) {
    console.error('Khalti verification error:', error);
    return {
      success: false,
      message: 'Payment verification failed',
    };
  }
}

/**
 * Convert NPR to paisa for Khalti
 */
export function convertToPaisa(amountInRupees: number): number {
  return Math.round(amountInRupees * 100);
}

/**
 * Convert paisa to NPR
 */
export function convertToRupees(amountInPaisa: number): number {
  return amountInPaisa / 100;
}
