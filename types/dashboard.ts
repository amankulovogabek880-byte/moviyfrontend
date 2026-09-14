export interface AdminDashboardStats {
  todayBookingsCount: number;
  pendingPaymentsCount: number;
  pendingPaymentsAmount: number;
  expiringSoonCount: number;
  totalRevenueThisMonth: number;
}

export interface B2BDashboardStats {
  activeBookingsCount: number;
  pendingPaymentAmount: number;
  recentBookings: import("./booking").Booking[];
  paymentType?: import("./partner").PartnerPaymentType;
  creditLimit?: number;
  creditBalance?: number;
}
