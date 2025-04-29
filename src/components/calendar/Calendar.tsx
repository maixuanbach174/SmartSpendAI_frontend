"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

import { MicroPhoneIcon } from "@/icons";

import { CalendarData } from "@/mock";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    spend?: number;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  type CalendarEventType = 'Transportation' | 'Food' | 'Personal' | 'Others';
  const [eventTitle, setEventTitle] = useState("");
  const [eventSpending, setEventSpending] = useState<number>(0);  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventType, setEventType] = useState<CalendarEventType | ''>("");
  const [eventSchedule, setEventSchedule] = useState("none");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState("");

  const calendarsEvents = {
    Transportation: "danger",
    Food: "success",
    Personal: "primary",
    Others: "warning",
  };

  useEffect(() => {
    // Initialize with some events
    const mappedEvents = CalendarData.map((event) => ({
      id: event.id.toString(),
      title: event.title,
      start: new Date(event.start || "").toISOString().split('T')[0],
      extendedProps: {
        calendar: calendarsEvents[event.type as CalendarEventType],
        spend: event.spending,
      },
    }));
    setEvents(mappedEvents);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventSpending(event.extendedProps.spend);
    setEventStartDate(event.startStr || event.start?.toISOString().split('T')[0] || '');
    setEventEndDate(event.endStr || event.end?.toISOString().split('T')[0] || event.startStr || event.start?.toISOString().split('T')[0] || '');
    setEventSchedule(event.extendedProps.schedule || "none");
    setEventType(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                spending: eventSpending,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventType ? calendarsEvents[eventType as CalendarEventType] : 'Others', spend: eventSpending },
              }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        spending: eventSpending,
        start: eventStartDate,
        end: eventEndDate,
        schedule: eventSchedule,
        allDay: true,
        extendedProps: { calendar: eventType ? calendarsEvents[eventType as CalendarEventType] : 'Others', spend: eventSpending },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventSpending(0);
    setEventStartDate("");
    setEventEndDate("");
    setEventSchedule("none");
    setEventType("");
    setSelectedEvent(null);
  };

  const handleEventDelete = () => {
    if (selectedEvent) {
      setEvents((prevEvents) => 
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      closeModal();
      resetModalFields();
    }
  };

  // Create wave animation component
  const VoiceWaveAnimation = () => {
    return (
      <div className="flex items-center gap-1 ml-2">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div 
            key={bar}
            className="w-1 bg-blue-500 rounded-full animate-pulse"
            style={{
              height: `${Math.max(12, Math.floor(Math.random() * 24))}px`,
              animationDelay: `${bar * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Function to handle voice recording
  const handleVoiceRecording = () => {
    setIsRecording(prev => !prev);
    
    if (!isRecording) {
      // Start recording logic would go here
      console.log("Started recording");
      // Mock transcript after a delay
      setTimeout(() => {
        setAudioTranscript("Meeting with client on Thursday at 2pm - $50 lunch budget");
        setIsRecording(false);
      }, 20000);
    } else {
      // Stop recording logic would go here
      setAudioTranscript("");
      handleStopRecording();
    }
  };

  // Microphone button component
  const MicrophoneButton = () => {
    return (
      <div className="flex items-center">
        <button
          onClick={handleVoiceRecording}
          className={`p-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center justify-center`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <MicroPhoneIcon className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-700'}`} />
        </button>
        {isRecording && <VoiceWaveAnimation />}
      </div>
    );
  };

  const mockAIEvent = {
    "title": "Dating",
    "spending": 50,
    "start": new Date("2025-05-01").toISOString().split('T')[0],
    "type": "Others"
  }

  // Function to fill modal with AI event data
  const fillModalWithAIData = () => {
    setEventTitle(mockAIEvent.title);
    setEventSpending(mockAIEvent.spending);
    setEventStartDate(mockAIEvent.start);
    setEventEndDate(mockAIEvent.start);
    setEventType(mockAIEvent.type as CalendarEventType);
    setEventSchedule("none");
    setSelectedEvent(null);
    console.log(eventStartDate);
  };

  // Function to handle recording stop
  const handleStopRecording = () => {
    setIsRecording(false);
    closeModal();
    fillModalWithAIData();
    openModal();
  };

  return (
    <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar hide-scrollbar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openModal,
            },
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on
              track
            </p>
          </div>
          <div className="mt-8">
            <div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Title
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Spending Amount
              </label>
              <div className="relative">
                <input
                  id="event-spending"
                  type="number"
                  value={eventSpending}
                  onChange={(e) => setEventSpending(parseFloat(e.target.value))}
                  placeholder="0.0"
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div
                      className={`form-check form-check-${value} form-check-inline`}
                    >
                      <label
                        className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        htmlFor={`modal${key}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            value={key}
                            id={`modal${key}`}
                            checked={eventType === key}
                            onChange={() => setEventType(key as CalendarEventType)}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${
                                eventType === key ? "block" : "hidden"
                              }`}  
                            ></span>
                          </span>
                        </span>
                        {key}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter Start Date
              </label>
              <div className="relative">
                <input
                  id="event-start-date"
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter End Date
              </label>
              <div className="relative">
                <input
                  id="event-end-date"
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="eventSchedule" className="form-label">
                Schedule
              </label>
              <select
                id="eventSchedule"
                className="form-select"
                value={eventSchedule}
                onChange={(e) => setEventSchedule(e.target.value)}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            {selectedEvent && (
              <button
                onClick={handleEventDelete}
                type="button"
                className="flex w-full justify-center rounded-lg border border-red-500 bg-white px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Delete Event
              </button>
            )}
            <MicrophoneButton />
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? "Update Changes" : "Add Event"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  const spending = eventInfo.event.extendedProps.spend || "";
  return (
    <div
      className={`event-fc-color flex flex-col fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="flex">
        <div className="fc-daygrid-event-dot"></div>
        {/* <div className="fc-event-time">{eventInfo.timeText}</div> */}
        <div className="fc-event-title break-words whitespace-normal overflow-wrap-anywhere" style={{ 
          overflow: "hidden", 
          maxHeight: "3rem",
          lineHeight: "1rem"
        }}>{eventInfo.event.title}</div>
      </div>
      {spending !== undefined && (
        <div className="text-xs mt-1 font-medium text-black">
          ${Number(spending).toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default Calendar;
