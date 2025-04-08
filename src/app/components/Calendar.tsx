/* eslint-disable tailwindcss/no-custom-classname */
import type {
  EventChangeArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  DateCalendar,
  LocalizationProvider,
  TimeClock,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Alert,
  Button,
  Label,
  Modal,
  Radio,
  Select,
  Tabs,
  ToggleSwitch,
} from "flowbite-react";
import moment, { Moment } from "moment";
import "moment/locale/el";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { IoMdAdd, IoMdAlert } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Roles } from "../../appReducer";
import useTheme, { THEME_CHANGE_EVENT } from "../../hooks/useTheme";
import { AppContext } from "../Root";
// import useToast from "../../hooks/useToast";

import "./calendarStyles.css";

interface Lab {
  id?: number;
  lab_name: string;
  lab_description: string;
  lab_year: number;
  lab_semester: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Teacher {
  id?: number;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LabInstance {
  id?: number;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: string;
  startRecur?: string;
  endRecur?: string;
  labId?: number;
  teacherId?: number;
  color?: string;
  lab?: Lab;
  teacher?: Teacher;
  students?: Array<any>;
}

enum ModalMode {
  create,
  update,
}

// function isCalendarEvent(
//   evt: EventClickArg | MouseEventHandler
// ): evt is EventClickArg {
//   return (evt as EventClickArg).jsEvent !== undefined;
// }

const daysOfWeek = [
  // "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  // "Σάββατο",
];

const emptyLabInstance: LabInstance = {
  id: undefined,
  startTime: undefined,
  endTime: undefined,
  daysOfWeek: undefined,
  startRecur: undefined,
  teacherId: undefined,
  labId: undefined,
  endRecur: undefined,
  color: undefined,
};

const colorList = [
  "#2196F3", // Blue
  "#FFC107", // Amber
  "#4CAF50", // Green
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#FF5722", // Deep Orange
];

const weekends = {
  weekendsVisible: false,
  currentEvents: [],
};

moment.locale("el");

const Calendar = ({
  data,
  refresh,
}: {
  data: any;
  refresh: () => Promise<void>;
}) => {
  const { theme } = useTheme();

  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const [modal, setModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode | undefined>(
    ModalMode.create
  );

  const [form, setForm] = useState<LabInstance>(emptyLabInstance);
  const [invalid, setInvalid] = useState(true);
  const [alert, setAlert] = useState<
    undefined | { text1: string; text2: string }
  >();
  const [dateError, setDateError] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<boolean>(false);

  const [labs, setLabs] = useState<Lab[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [startTime, setStartTime] = useState<Moment>(moment());
  const [endTime, setEndTime] = useState<Moment>(moment());

  const [startRecur, setStartRecur] = useState<Moment>(moment());
  const [endRecur, setEndRecur] = useState<Moment>(moment());
  const [useHtmlTimePicker, setUseHtmlTimePicker] = useState<boolean>(false);
  const navigate = useNavigate();

  // const { showToast } = useToast();

  // const currLabInstance = useRef<LabInstance>(emptyLabInstance);

  const events = useMemo(
    () =>
      data.map((lab: LabInstance) => ({
        ...lab,
        instanceData: lab,
        title: `${lab.lab?.lab_name}`,
        startTime: lab.startTime,
        endTime: lab.endTime,
        daysOfWeek: [lab.daysOfWeek],
        startRecur: moment(lab.startRecur).format("YYYY-MM-DD"),
        endRecur: moment(lab.endRecur).format("YYYY-MM-DD"),
      })),
    [data]
  );

  const getTeachers = async () => {
    setTeachers([]);
    const { data } = await api.get<Teacher[]>("api/teacher/");
    setTeachers(data);
  };

  const getLabs = async () => {
    setLabs([]);
    const { data } = await api.get<Lab[]>("api/labs");
    setLabs(data);
  };

  useEffect(() => {
    getLabs();
    getTeachers();
  }, []);

  useEffect(() => {
    if (modalMode === ModalMode.create) {
      setForm({
        ...form,
        labId: labs[0]?.id,
        teacherId: teachers[0]?.id,
        daysOfWeek: "1",
        color: colorList[0],
      });
    }
  }, [labs, teachers]);

  const getTimeFormat = (moment: Moment | string, forForm = false): string => {
    if (typeof moment === "string") {
      return moment;
    } else {
      return forForm
        ? moment.format("HH:mm")
        : moment.locale("el").format("HH:mm");
    }
  };

  const getDateFormat = (moment: Moment | string): string => {
    if (typeof moment === "string") {
      return moment;
    } else {
      return moment.locale("el").format("YYYY-MM-DD");
    }
  };

  const handleChange = (event: any) => {
    let value: string | number = parseInt(event.target.value);
    if (event.target.id === "startRecur" || event.target.id === "endRecur") {
      const m = moment(event.target.value);
      value = m.format("YYYY-MM-DD");
      if (event.target.id === "startRecur") {
        setStartRecur(m);
      } else {
        setEndRecur(m);
      }
    } else if (
      event.target.id === "startTime" ||
      event.target.id === "endTime"
    ) {
      value = event.target.value;
      const m = moment(value, "HH:mm");
      if (event.target.id === "startTime") {
        setStartTime(m);
      } else {
        setEndTime(m);
      }
    } else {
      if (isNaN(value)) {
        value = event.target.value;
      }
    }

    setForm({
      ...form,
      [event.target.id]: value,
    });
    setTimeout(() => {
      event.target.focus();
    });
  };

  useEffect(() => {
    // currLabInstance.current.startTime = getTimeFormat(startTime);
    // currLabInstance.current.endTime = getTimeFormat(endTime);
    setForm({
      ...form,
      startTime: getTimeFormat(startTime, true),
      endTime: getTimeFormat(endTime, true),
    });
  }, [startTime, endTime]);

  useEffect(() => {
    // currLabInstance.current.startTime = getTimeFormat(startTime);
    // currLabInstance.current.endTime = getTimeFormat(endTime);
    setForm({
      ...form,
      startRecur: getDateFormat(startRecur),
      endRecur: getDateFormat(endRecur),
    });
  }, [startRecur, endRecur]);

  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  // const sendEdit = () => {
  //   setIsProcessing(false)
  // }

  const sendNew = async () => {
    setIsProcessing(true);
    await api.post("api/labinstance", form);
    refresh().then(() => {
      closeModal();
    });
    setIsProcessing(false);
  };

  const sendEdit = async () => {
    setIsProcessing(true);
    await api.put(`api/labinstance/${form.id}`, form);
    refresh().then(() => {
      closeModal();
    });
    setIsProcessing(false);
  };

  const eventClick = (e: EventClickArg | EventContentArg) => {
    // if (isCalendarEvent(e)) {
    // e.jsEvent.stopPropagation();
    const eventObj = e.event.toPlainObject();

    const labInstance: LabInstance = eventObj.extendedProps.instanceData;
    labInstance.teacherId = labInstance.teacher?.id;
    labInstance.labId = labInstance.lab?.id;

    setStartRecur(moment(labInstance.startRecur));
    setEndRecur(moment(labInstance.endRecur));
    setStartTime(moment(labInstance.startTime, "HH:mm"));
    setEndTime(moment(labInstance.endTime, "HH:mm"));

    setModal(true);
    setForm(labInstance);
    setModalMode(ModalMode.update);
    // }
  };

  const eventChanged = async (e: EventChangeArg) => {
    const eventObj = e.event.toPlainObject();

    const labInstance: LabInstance = eventObj.extendedProps.instanceData;
    labInstance.teacherId = labInstance.teacher?.id;
    labInstance.labId = labInstance.lab?.id;
    labInstance.startTime = moment(e.event.startStr).format("HH:mm");
    labInstance.endTime = moment(e.event.endStr).format("HH:mm");
    labInstance.daysOfWeek = `${moment(e.event.endStr).day()}`;

    delete labInstance.teacher;
    delete labInstance.lab;
    delete labInstance.students;
    try {
      await api.put(`api/labinstance/${labInstance.id}`, labInstance);
      refresh();
    } catch (err) {
      e.revert();
    }
  };

  useEffect(() => {
    const timeIsNotGood = startTime.isSameOrAfter(endTime);
    const dateIsNotGood = moment(form.startRecur).isSameOrAfter(form.endRecur);

    setTimeError(timeIsNotGood);
    setDateError(dateIsNotGood);

    if (timeIsNotGood || dateIsNotGood) {
      if (dateIsNotGood) {
        setAlert({
          text1: "Μη έγκυρο εύρος ημερομηνιών!",
          text2:
            "Βεβαιωθείτε ότι η ημερομηνία έναρξης προηγείται της ημερομηνίας λήξης",
        });
      } else if (timeIsNotGood) {
        setAlert({
          text1: "Μη έγκυρο εύρος χρόνου!",
          text2: "Βεβαιωθείτε ότι η ώρα έναρξης προηγείται της ώρας λήξης",
        });
      }
      setInvalid(true);
      return;
    }
    let invalid = false;

    for (const [k, v] of Object.entries(form)) {
      if (k === "id") {
        continue;
      }
      if (v === undefined) {
        invalid = true;
      }
    }
    if (!invalid) {
      setAlert(undefined);
    }
    setInvalid(invalid);
  }, [form]);

  const resetForm = () => {
    setForm({
      id: undefined,
      labId: labs[0]?.id,
      teacherId: teachers[0]?.id,
      daysOfWeek: "1",
      color: colorList[0],
      startRecur: getDateFormat(moment()),
      endRecur: getDateFormat(moment()),
      startTime: getTimeFormat(moment(), true),
      endTime: getTimeFormat(moment(), true),
    });
    setStartRecur(moment());
    setEndRecur(moment());
    setStartTime(moment());
    setEndTime(moment());
  };

  const navigateToLabinstance = (id: number) => {
    navigate(`/subscriptions/${id}`);
  };

  const deleteLabInstance = async (id: number) => {
    await api.delete(`api/labinstance/${id}`);
    refresh();
  };

  const { state } = useContext(AppContext);
  const plugins = [];
  if (state.currentUser?.role === Roles.teacher) {
    plugins.push(...[timeGridPlugin, dayGridPlugin]);
  } else {
    plugins.push(...[timeGridPlugin, dayGridPlugin, interactionPlugin]);
  }

  const calendarRef = useRef(null);

  // Watch for theme changes
  useEffect(() => {
    // Initialize from localStorage
    const checkTheme = () => {
      const theme = localStorage.getItem("theme");
      const isDark =
        theme === "dark" ||
        (theme === null &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(isDark);
    };

    // Check initially
    checkTheme();

    // Set up an observer to watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          // Use requestAnimationFrame to schedule state update outside React's rendering cycle
          requestAnimationFrame(() => {
            const htmlElement = document.documentElement;
            const hasDarkClass = htmlElement.classList.contains("dark");
            setIsDarkMode(hasDarkClass);
          });
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Also watch for localStorage changes
    const storageListener = () => {
      checkTheme();
    };

    // Listen for custom theme change event
    const themeChangeListener = (e: CustomEvent) => {
      const newTheme = e.detail?.theme;
      if (newTheme === "dark" || newTheme === "light") {
        // Use requestAnimationFrame to schedule state update outside React's rendering cycle
        requestAnimationFrame(() => {
          setIsDarkMode(newTheme === "dark");
        });
      }
    };

    window.addEventListener("storage", storageListener);
    window.addEventListener(
      THEME_CHANGE_EVENT,
      themeChangeListener as EventListener
    );

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", storageListener);
      window.removeEventListener(
        THEME_CHANGE_EVENT,
        themeChangeListener as EventListener
      );
    };
  }, []);

  // Update isDarkMode when theme prop changes
  useEffect(() => {
    // Use requestAnimationFrame to schedule state update outside React's rendering cycle
    requestAnimationFrame(() => {
      setIsDarkMode(theme === "dark");
    });
  }, [theme]);

  // Force rerender when theme changes to ensure calendar updates
  useEffect(() => {
    // If calendar has been rendered, force a window resize event
    // This is a common trick to make FullCalendar redraw itself
    if (calendarRef.current) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [isDarkMode]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between pb-8">
        <div className="light:text-black text-2xl dark:text-white">
          Πρόγραμμα Εργαστηρίων
        </div>
        <Button
          size={"md"}
          onClick={() => {
            resetForm();
            setModalMode(ModalMode.create);
            openModal();
          }}
        >
          <IoMdAdd className="mr-2" />
          Προσθήκη
        </Button>
      </div>

      <div
        className={`fullcalendar-container ${
          isDarkMode ? "fc-dark-theme" : ""
        }`}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={plugins}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          locale="el"
          weekends={weekends.weekendsVisible}
          eventClick={(e) => {
            const obj = e.event.toPlainObject();
            navigateToLabinstance(obj.id);
          }}
          selectable={false}
          eventChange={eventChanged}
          eventDidMount={(arg) => {
            arg.el.addEventListener("contextmenu", (jsEvent) => {
              jsEvent.preventDefault();
              eventClick(arg as unknown as EventClickArg);
            });
          }}
          events={events}
          eventContent={(event) => {
            const obj = event.event.toPlainObject();

            return (
              <div className="overflow-hidden" style={{ height: "inherit" }}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-1">
                    <span
                      data-tooltip-id="tooltip"
                      data-tooltip-content={obj.title}
                      className="overflow-hidden text-ellipsis font-semibold"
                    >
                      {obj.title}
                    </span>
                    <div className="flex grow flex-row justify-end">
                      <div className="h-fit w-fit rounded-full p-1">
                        <AiFillEdit
                          size={"15"}
                          className="hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            eventClick(event);
                          }}
                        ></AiFillEdit>
                      </div>
                      <div className="h-fit w-fit rounded-full p-1">
                        <AiFillDelete
                          size={"15"}
                          className="hover:text-red-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            deleteLabInstance(obj.id);
                          }}
                        ></AiFillDelete>
                      </div>
                    </div>
                  </div>
                  <div>
                    {moment(obj.start).format("hh:mm a")} -{" "}
                    {moment(obj.end).format("hh:mm a")}
                  </div>
                  <div className="overflow-hidden text-ellipsis">
                    {obj.extendedProps.user.username}
                  </div>
                </div>
              </div>
            );
          }}
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
      <Modal onClose={closeModal} position="center" show={modal} size={"3xl"}>
        <Modal.Header>
          {modalMode === ModalMode.create
            ? "Νέο Εργαστήριο"
            : "Ενημέρωση εργαστηρίου"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-row gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Εργαστήριο" />
                </div>
                <Select
                  id="labId"
                  value={form.labId}
                  onChange={handleChange}
                  required
                >
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.lab_name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Διδάσκον καθηγητής" />
                </div>
                <Select
                  id="teacherId"
                  value={form.teacherId}
                  onChange={handleChange}
                  required
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Ημέρα" />
                </div>
                <Select
                  id="daysOfWeek"
                  defaultValue={"1"}
                  value={form.daysOfWeek}
                  onChange={handleChange}
                  required
                >
                  {daysOfWeek.map((day, i) => (
                    <option key={day} value={`${i + 1}`}>
                      {day}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Χρώμα" />
                </div>
                <fieldset
                  className="flex h-[40px] flex-row items-center justify-center gap-6"
                  id="color"
                >
                  {colorList.map((color, i) => (
                    <Radio
                      id={"color"}
                      key={color}
                      defaultChecked={i === 0}
                      checked={form.color === color}
                      name={"colors"}
                      value={color}
                      onChange={handleChange}
                      className="color-radio-input"
                      style={{
                        accentColor: color,
                        backgroundColor:
                          form.color === color ? color : "transparent",
                        borderColor: color,
                      }}
                    />
                  ))}
                </fieldset>
              </div>
            </div>

            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale="el"
            >
              <Tabs.Group aria-label="Calendar picker tabs" style="underline">
                <Tabs.Item
                  active
                  title={
                    <span
                      className={dateError ? "font-medium text-red-600" : ""}
                    >
                      Επιλογή περιόδου εργαστηρίου
                      {dateError && <span className="ml-2">⚠️</span>}
                    </span>
                  }
                >
                  <div className="mt-4 flex flex-row">
                    <div className="flex flex-1 flex-col items-center">
                      <h3
                        className={`mb-3 text-base font-medium dark:text-white ${
                          dateError ? "text-red-600 dark:text-red-400" : ""
                        }`}
                      >
                        Ημερομηνία έναρξης:{" "}
                        {startRecur.locale("el").format("DD MMMM YYYY")}
                      </h3>
                      <DateCalendar
                        value={startRecur}
                        onChange={(e: any) => setStartRecur(moment(e))}
                        className={`${
                          isDarkMode ? "dark-calendar" : "light-calendar"
                        } ${dateError ? "error-calendar" : ""}`}
                      />
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                      <h3
                        className={`mb-3 text-base font-medium dark:text-white ${
                          dateError ? "text-red-600 dark:text-red-400" : ""
                        }`}
                      >
                        Ημερομηνία λήξης:{" "}
                        {endRecur.locale("el").format("DD MMMM YYYY")}
                      </h3>
                      <DateCalendar
                        value={endRecur}
                        onChange={(e: any) => setEndRecur(moment(e))}
                        className={`${
                          isDarkMode ? "dark-calendar" : "light-calendar"
                        } ${dateError ? "error-calendar" : ""}`}
                      />
                    </div>
                  </div>
                </Tabs.Item>
                <Tabs.Item
                  title={
                    <span
                      className={timeError ? "font-medium text-red-600" : ""}
                    >
                      Επιλογή ώρας
                      {timeError && <span className="ml-2">⚠️</span>}
                    </span>
                  }
                >
                  <div className="mb-4 flex w-full flex-row items-center justify-between gap-2">
                    <div className="flex w-full flex-row gap-2 text-center text-base font-bold">
                      <div className="flex-1 dark:text-white">
                        Αρχή {getTimeFormat(startTime)}
                      </div>
                      <div className="flex-1 dark:text-white">
                        Τέλος {getTimeFormat(endTime)}
                      </div>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={useHtmlTimePicker}
                    className="mb-4"
                    onChange={setUseHtmlTimePicker}
                    label="Απλοποιημένη επιλογή ώρας"
                  />

                  {useHtmlTimePicker ? (
                    <div className="flex flex-row items-center justify-center gap-8 py-8">
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="htmlStartTime"
                          value="Ώρα έναρξης"
                          className={timeError ? "text-red-600" : ""}
                        />
                        <input
                          id="htmlStartTime"
                          type="time"
                          className={`rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white ${
                            timeError
                              ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          value={startTime.format("HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":");
                            const newTime = moment()
                              .hours(Number(hours))
                              .minutes(Number(minutes));
                            setStartTime(newTime);
                            setForm({
                              ...form,
                              startTime: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="htmlEndTime"
                          value="Ώρα λήξης"
                          className={timeError ? "text-red-600" : ""}
                        />
                        <input
                          id="htmlEndTime"
                          type="time"
                          className={`rounded-lg border px-4 py-2 dark:bg-gray-700 dark:text-white ${
                            timeError
                              ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          value={endTime.format("HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":");
                            const newTime = moment()
                              .hours(Number(hours))
                              .minutes(Number(minutes));
                            setEndTime(newTime);
                            setForm({
                              ...form,
                              endTime: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row">
                      <TimeClock
                        showViewSwitcher={true}
                        ampm={false}
                        value={startTime}
                        ampmInClock={true}
                        className={`flex-1 ${
                          isDarkMode ? "dark-calendar" : "light-calendar"
                        } ${timeError ? "error-calendar" : ""}`}
                        onChange={(e: any) => setStartTime(moment(e))}
                      />
                      <TimeClock
                        showViewSwitcher={true}
                        ampm={false}
                        value={endTime}
                        ampmInClock={true}
                        className={`flex-1 ${
                          isDarkMode ? "dark-calendar" : "light-calendar"
                        } ${timeError ? "error-calendar" : ""}`}
                        onChange={(e: any) => setEndTime(moment(e))}
                      />
                    </div>
                  )}
                </Tabs.Item>
              </Tabs.Group>
            </LocalizationProvider>
            {alert && (
              <Alert color="failure" icon={IoMdAlert}>
                <span>
                  <p>
                    <span className="mr-2 font-medium">{alert.text1}</span>
                    {alert.text2}
                  </p>
                </span>
              </Alert>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          {modalMode === ModalMode.update && (
            <Button
              color="light"
              className=" mr-auto"
              onClick={() => navigate(`/subscriptions/${form.id}`)}
            >
              <span className="mr-2">Έλεγχος Απουσιών</span>
              <BsBoxArrowInUpRight />
            </Button>
          )}
          <Button color="gray" onClick={closeModal}>
            Άκυρο
          </Button>
          <Button
            disabled={invalid}
            isProcessing={isProcessing}
            onClick={modalMode === ModalMode.update ? sendEdit : sendNew}
          >
            Αποθήκευση
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
