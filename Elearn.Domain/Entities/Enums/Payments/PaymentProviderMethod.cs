namespace Elearn.Domain.Entities.Enums
{
    public enum PaymentProviderMethod
    {
        /// <summary>
        /// Thanh toán qua thẻ ATM
        /// </summary>
        ATM = 0,
        
        /// <summary>
        /// Thanh toán qua mã QR
        /// </summary>
        QR = 1,
        
        /// <summary>
        /// Thanh toán quốc tế
        /// </summary>
        INTL = 2
    }
}

