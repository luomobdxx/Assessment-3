export interface EventItem {
  event_id: number;
  name: string;
  purpose: string;
  ngo_name: string;
  full_description: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  goal_amount: number;
  progress_amount: number;
  ticket_price: number;
  latitude: string;
  longitude: string;
  currency: string;
  image_url: string;
  status: string;
  stats?: any;
}
