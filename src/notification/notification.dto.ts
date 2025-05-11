export class NotificationDto {
  constructor(
    public userId: string,
    public nftId: string,
    public type: string,
    public message: string,
  ) {}
}
