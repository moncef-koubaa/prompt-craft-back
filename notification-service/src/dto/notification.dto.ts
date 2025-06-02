export class NotificationDto {
  constructor(
      public userId: number,
      public nftId: number,
      public type: string,
      public message: string,
  ) {}
}
