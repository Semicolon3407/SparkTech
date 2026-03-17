import crypto from 'crypto';

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '';
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || '';
const ESEWA_API_URL = process.env.ESEWA_API_URL || 'https://rc-epay.esewa.com.np'; // Use rc for sandbox

interface EsewaPaymentParams {
  amount: number;
  taxAmount: number;
  totalAmount: number;
  transactionUuid: string;
  productCode: string;
  productServiceCharge: number;
  productDeliveryCharge: number;
  successUrl: string;
  failureUrl: string;
}

interface EsewaVerifyResponse {
  success: boolean;
  message: string;
  transactionUuid?: string;
  totalAmount?: number;
  status?: string;
  refId?: string;
}

/**
 * Generate HMAC SHA256 signature for eSewa
 */
function generateSignature(message: string): string {
  return crypto
    .createHmac('sha256', ESEWA_SECRET_KEY)
    .update(message)
    .digest('base64');
}

/**
 * Create eSewa payment initiation data
 */
export function createEsewaPayment(params: EsewaPaymentParams) {
  const {
    amount,
    taxAmount,
    totalAmount,
    transactionUuid,
    productCode,
    productServiceCharge,
    productDeliveryCharge,
    successUrl,
    failureUrl,
  } = params;

  // Create signature message
  const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode || ESEWA_MERCHANT_CODE}`;
  const signature = generateSignature(signatureMessage);

  return {
    url: `${ESEWA_API_URL}/api/epay/main/v2/form`,
    method: 'POST',
    data: {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: productCode || ESEWA_MERCHANT_CODE,
      product_service_charge: productServiceCharge.toString(),
      product_delivery_charge: productDeliveryCharge.toString(),
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    },
  };
}

/**
 * Verify eSewa payment
 */
export async function verifyEsewaPayment(encodedData: string): Promise<EsewaVerifyResponse> {
  try {
    // Decode the base64 response from eSewa
    const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
    
    const { transaction_uuid, total_amount, status, product_code, signed_field_names, signature } = decodedData;

    // Verify signature
    const signatureMessage = signed_field_names
      .split(',')
      .map((field: string) => `${field}=${decodedData[field]}`)
      .join(',');
    
    const expectedSignature = generateSignature(signatureMessage);
    
    if (signature !== expectedSignature) {
      return {
        success: false,
        message: 'Invalid signature - Payment verification failed',
      };
    }

    // Verify with eSewa API
    const verifyResponse = await fetch(
      `${ESEWA_API_URL}/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.status === 'COMPLETE') {
      return {
        success: true,
        message: 'Payment verified successfully',
        transactionUuid: transaction_uuid,
        totalAmount: parseFloat(total_amount),
        status: verifyData.status,
        refId: verifyData.ref_id,
      };
    }

    return {
      success: false,
      message: `Payment status: ${verifyData.status}`,
      status: verifyData.status,
    };
  } catch (error) {
    console.error('eSewa verification error:', error);
    return {
      success: false,
      message: 'Payment verification failed',
    };
  }
}

/**
 * Generate unique transaction UUID
 */
export function generateTransactionUuid(orderId: string): string {
  const timestamp = Date.now();
  return `${orderId}-${timestamp}`;
}
