export interface Event {
  event_id: number;
  name: string;
  ngo_name: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  goal_amount: number;
  progress_amount: number;
  ticket_price: number;
  currency: string;
  image_url: string;
}
