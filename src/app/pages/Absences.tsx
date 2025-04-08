/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Spinner, Table, TextInput } from "flowbite-react";
import greelUtils from "greek-utils";
import { groupBy, sortBy } from "lodash";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd, IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import AbsencesModal from "../components/Absences.modal";
import ModuleWrapper from "../components/ModuleWrapper";

interface Subscription {
  id: number;
  name: string;
  register_number: string;
  subscriptionDate: string;
}

export interface Student {
  id: number;
  name: string;
  register_number: string;
}

const Absences = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [students, setStudents] = useState<Student[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");

  const { id: labInstanceId } = useParams();
  const id = parseInt(labInstanceId as string);
  const getStudents = async () => {
    try {
      const { data } = await api.get<Student[]>("api/student");
      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData().then(() => {
      getStudents();
    });
  }, []);

  const refresh = () => {
    getData().then(() => {
      getStudents();
    });
  };

  const getData = async () => {
    setLoad(true);
    setSubscriptions([]);
    try {
      const { data } = await api.get<Subscription[]>(`api/subscriptions/${id}`);
      setSubscriptions(data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const sendDelete = async (sub: Subscription) => {
    await api.delete(`api/subscriptions/${id}`, {
      data: {
        labInstanceId: id,
        studentId: sub.id,
        subscriptionDate: sub.subscriptionDate,
      },
    });
    refresh();
  };

  const subsObj = useMemo(() => {
    return groupBy(subscriptions, (s) =>
      moment(s.subscriptionDate).format("YYYY-MM-DD")
    );
  }, [subscriptions]);

  const subs = useMemo(() => {
    const subEntries = Object.entries(subsObj);
    const todaySubs = subEntries.find((e) => {
      return moment(e[0]).isSame(new Date(), "day");
    });
    if (!todaySubs) {
      subEntries.push([`${moment().format("YYYY-MM-DD")}`, []]);
    }
    return subEntries;
  }, [subsObj]);

  const currentSubs = useMemo(() => {
    if (selectedDate) {
      if (Array.isArray(subsObj[selectedDate])) {
        return subsObj[selectedDate];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [subsObj, selectedDate]);

  const searchedSubs = useMemo(() => {
    const numSerch = parseInt(search);
    let key: "name" | "register_number" = "register_number";
    if (isNaN(numSerch)) {
      key = "name";
    }

    return currentSubs.filter((s) => {
      let searchStr = s[key];
      if (typeof searchStr !== "string") {
        searchStr = `${searchStr}`;
      } else {
        searchStr = greelUtils.toGreeklish(searchStr.toLowerCase());
      }

      return searchStr.includes(search);
    });
  }, [currentSubs, search]);

  const filteredStudents: Student[] = useMemo<Student[]>(() => {
    if (selectedDate) {
      const studentIds = subsObj[selectedDate]?.map((s) => s.id);
      return students.filter((s) => !studentIds?.includes(s.id));
    } else {
      return students;
    }
  }, [students, selectedDate, subsObj]);

  return (
    <ModuleWrapper>
      <div className="flex w-full flex-col gap-6">
        {selectedDate && (
          <>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-3 dark:text-white">
                <div onClick={() => setSelectedDate(undefined)}>
                  <IoMdArrowBack size={25}></IoMdArrowBack>
                </div>
                <div className="text-2xl">
                  {moment(selectedDate).format("Do MMMM YYYY")}
                </div>
              </div>
              <Button size={"md"} onClick={openModal}>
                <IoMdAdd className="mr-2" />
                Εγγραφή φοιτητών
              </Button>
            </div>
            <div className=" flex flex-row justify-between">
              <TextInput
                id="search"
                placeholder="Αναζήτηση"
                className=" basis-[400px]"
                rightIcon={FiSearch}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setTimeout(() => {
                    e.target.focus();
                  });
                }}
                type="text"
              />
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>A/M</Table.HeadCell>
                <Table.HeadCell>Όνομα</Table.HeadCell>
                <Table.HeadCell className=" w-3">
                  <span className="sr-only">Delete</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {searchedSubs.map((subscription) => (
                  <Table.Row
                    key={subscription.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {subscription.register_number}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {subscription.name}
                    </Table.Cell>

                    <Table.Cell>
                      <Button
                        pill
                        size={"xs"}
                        color="failure"
                        onClick={() => sendDelete(subscription)}
                      >
                        <MdDelete />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {currentSubs.length === 0 && (
              <div className="mt-3 text-center text-sm text-gray-400">
                Κανένας εγγεγραμμένος φοιτητής
              </div>
            )}
          </>
        )}

        {!selectedDate && (
          <>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-3 dark:text-white">
                <Link to={"/"}>
                  <IoMdArrowBack size={25}></IoMdArrowBack>
                </Link>
                <div className="text-2xl">Επιλογή Ημερομινίας</div>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-4">
              {sortBy(subs, (s) => s[0]).map(([subscriptionDate, subs]) => (
                <CardWithActionButton
                  key={subscriptionDate}
                  date={subscriptionDate}
                  subs={subs}
                  setDate={setSelectedDate}
                />
              ))}
            </div>
          </>
        )}
        {load && (
          <div className="w-full text-center">
            <Spinner className="text-center" size={"xl"} />
          </div>
        )}
      </div>
      {modal && (
        <AbsencesModal
          closeModal={closeModal}
          modal={modal}
          students={filteredStudents}
          labId={id}
          refresh={refresh}
          date={selectedDate}
        />
      )}
    </ModuleWrapper>
  );
};

function CardWithActionButton({
  date,
  subs,
  setDate,
}: {
  date: string;
  subs: Subscription[];
  setDate: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { firstThree, rest } = useMemo(() => {
    const firstThree = subs.slice(0, 3);
    const rest = subs.slice(3);
    return { firstThree, rest };
  }, [subs]);
  const isToday = moment(date).isSame(new Date(), "day");
  return (
    <Card className="max-w-sm">
      <h5 className="text-left text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <p>
          {moment(date).format("Do MMMM YYYY")}{" "}
          {isToday && <span className="text-base text-gray-500">(Σήμερα)</span>}
        </p>
      </h5>
      <div className="max-h-24 min-w-[334px] grow font-normal text-gray-700 dark:text-gray-400">
        <div className="flex flex-col items-start">
          {firstThree.map((sub) => (
            <div key={sub.id}>{sub.name}</div>
          ))}
          {rest?.length > 0 && <>+ {rest?.length} φοιτητές</>}
        </div>
      </div>
      <Button onClick={() => setDate(date)}>
        <p>Παρουσιολόγιο</p>
        <IoMdArrowForward />
      </Button>
    </Card>
  );
}

export default Absences;
