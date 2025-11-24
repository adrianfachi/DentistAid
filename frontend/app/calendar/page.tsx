import Body from "../_components/Body";
import { ContinuousCalendar } from "../_components/ContinuosCalendar";

export default function Calendar() {
  return (
    <Body activeNavBar="calendar">
      <div className="flex-1">
        <ContinuousCalendar />
      </div>
    </Body>
  );
}
