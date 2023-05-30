import {
  Button,
  Label,
  Modal,
  Spinner,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import api from "../../api";
import ModuleWrapper from "../components/ModuleWrapper";

interface Lab {
  id?: number;
  lab_name: string;
  lab_description: string;
  createdAt?: string;
  updatedAt?: string;
}

enum ModalMode {
  create,
  update,
}

const Labs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode | undefined>();
  const selectedLab = useRef<Lab>({
    id: NaN,
    lab_name: "",
    lab_description: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoad(true);
    setLabs([]);
    try {
      const { data } = await api.get<Lab[]>("api/labs");
      setLabs(data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  const sendEdit = async () => {
    await api.put<Lab>(
      `api/labs/${selectedLab.current.id}`,
      selectedLab.current
    );
    closeModal();
    getData();
  };

  const sendNew = async () => {
    await api.post<Lab>(`api/labs`, selectedLab.current);
    closeModal();
    getData();
  };

  const sendDelete = async (id: number) => {
    await api.delete<Lab>(`api/labs/${id}`);
    getData();
  };

  const onEdit = (lab: Lab) => {
    selectedLab.current = lab;
    openModal(ModalMode.update);
  };

  const addNew = () => {
    selectedLab.current = {
      lab_name: "",
      lab_description: "",
    };
    openModal(ModalMode.create);
  };

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setModal(true);
  };

  const closeModal = () => {
    setModalMode(undefined);
    setModal(false);
  };

  return (
    <ModuleWrapper>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl">Εργαστίρια</div>
          <Button size={"md"} onClick={addNew}>
            <IoMdAdd className="mr-2" />
            Προσθήκη
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Lab</Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {labs.map((lab) => (
              <Table.Row
                key={lab.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {lab.lab_name}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    pill
                    size={"xs"}
                    color="failure"
                    onClick={() =>
                      typeof lab.id === "number" && sendDelete(lab.id)
                    }
                  >
                    <MdDelete />
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button pill size={"xs"} onClick={() => onEdit(lab)}>
                    <MdEdit />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {load && (
          <div className="w-full text-center">
            <Spinner className="text-center" size={"xl"} />
          </div>
        )}
      </div>

      <Modal onClose={closeModal} position="center" show={modal}>
        <Modal.Header>
          {modalMode === ModalMode.update
            ? selectedLab.current.lab_name
            : "Νέο Εργαστίριο"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label value="Lab Name" />
              </div>
              <TextInput
                defaultValue={selectedLab.current.lab_name}
                onChange={(e) =>
                  (selectedLab.current.lab_name = e.target.value)
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Lab Description" />
              </div>
              <Textarea
                defaultValue={selectedLab.current.lab_description}
                onChange={(e) =>
                  (selectedLab.current.lab_description = e.target.value)
                }
                placeholder="Lab Description..."
                required
                rows={4}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="gray" onClick={closeModal}>
            Άκυρο
          </Button>
          <Button onClick={modalMode === ModalMode.update ? sendEdit : sendNew}>
            Αποθήκευση
          </Button>
        </Modal.Footer>
      </Modal>
    </ModuleWrapper>
  );
};

export default Labs;
