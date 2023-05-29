import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// import { useState } from "react";

// import { ModalInfosEventCalendar } from "./ModalInfosEventCalendar";
// import { useDisclosure } from "../hooks/useDiscloure";
// import { useState } from "react";
// import { ContainerCalendar } from "./styles";
// import { updateEventCalendar } from "../services/eventCalendarApi";
// import { toast } from "react-toastify";
// import { IEventCalendar } from "../domain/EventCalendar";

// type CalendarProps = {
//   eventsCalendar: IEventCalendar[];
// }

const Calendar = ({ events }: { events: any }) => {
  console.log(events);
  // events = [
  //   {
  //     "id": 1,
  //     "startTime": "10:10:00",
  //     "endTime": "10:30:00",
  //     "daysOfWeek": [
  //         0
  //     ],
  //     "startRecur": "2023-05-02",
  //     "endRecur": "2023-06-30",
  //     "title": "Database Management Systems"
  // },
  //   // {
  //   //   title: "Weekly Presentation",
  //   //   daysOfWeek: [2], // Tuesday
  //   //   startTime: "14:00", // Start time in HH:mm format
  //   //   endTime: "16:00", // End time in HH:mm format
  //   //   startRecur: "2023-05-02", // Start date for recurring events
  //   //   endRecur: "2023-05-30", // End date for recurring events
  //   // },
  //   // Add more recurring events as needed
  // ];
  
  //   const [eventInfos, setEventInfos] = useState();
  //   const [isEditCard, setIsEditCard] = useState<boolean>(false);

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  //   const modalInfosEvent = useDisclosure(false);

  const handleAddEventSelectAndOpenModal = (_selectInfo: any) => {
    // setIsEditCard(false);
    // setEventInfos(selectInfo);
    // modalInfosEvent.handleOpen();
  };

  const handleEditEventSelectAndOpenModal = (_clickInfo: any) => {
    // setIsEditCard(true);
    // setEventInfos(clickInfo);
    // modalInfosEvent.handleOpen();
  };

  const handleUpdateEventSelect = async (_changeInfo: any) => {
    try {
      //   const eventCalendarUpdated = {
      //     eventCalendar: {
      //       _id: changeInfo.event.id,
      //       title: changeInfo.event.title,
      //       start: changeInfo.event.startStr,
      //       end: changeInfo.event.endStr,
      //       backgroundColor: changeInfo.event.backgroundColor,
      //       textColor: changeInfo.event.textColor,
      //     },
      //   };
      //   await updateEventCalendar(eventCalendarUpdated);
    } catch (err) {
      //   toast.error('Houve um erro ao atualizar o evento');
    }
  };

  return (
    <div className="w-full">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale="el"
        weekends={weekends.weekendsVisible}
        select={handleAddEventSelectAndOpenModal}
        eventClick={handleEditEventSelectAndOpenModal}
        eventChange={handleUpdateEventSelect}
        events={events}
        longPressDelay={1000}
        eventLongPressDelay={1000}
        selectLongPressDelay={1000}
        selectable={true}
        dayMaxEvents={true}
        allDaySlot={false}
        editable={true}
        height="700px"
        buttonText={{
          today: "Σήμερα",
          month: "Μήνας",
          week: "Εβδομάδα",
          day: "Ημέρα",
          list: "Λίστα",
        }}
      />
    </div>
  );
};

export default Calendar;
