import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuPlus } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SummaryCard from "../../components/Cards/SummaryCard";
import moment from "moment";
import { CARD_BG } from "../../utils/data";
import Modal from "../../components/Modal";
import { CreateSessionForm } from "./CreateSessionForm";
import { toast } from "react-hot-toast";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const deleteSession = async (data) => {
    try {
      const response = await axiosInstance.delete(
        `${API_PATHS.SESSION.DELETE}${data._id}`
      );

      if (response.status === 200) {
        toast.success("Session deleted successfully");
        fetchAllSessions();
        setOpenDeleteAlert({ open: false, data: null });
      }
    } catch (error) {
      console.error("Error deleting session data:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 pt-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.length > 0 ? (
            sessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || "Untitled Role"}
                focusTopics={data?.focusTopics || "No topics"}
                experience={data?.experience || "--"}
                questions={data?.questions?.length || "--"}
                description={data?.description || "No description provided"}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("Do MMM YYYY")
                    : "Not Updated"
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              No interview sessions found. Start by adding a new one.
            </div>
          )}
        </div>

        {/* Add New Floating Button */}
        <button
          className="h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-6 py-2.5 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 fixed bottom-8 right-8 z-50"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-xl" />
          Add New
        </button>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>
      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Session"
      >
        <div className="w-full md:w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this session?"
            onDelete={() => {
              deleteSession(openDeleteAlert.data);
              setOpenDeleteAlert({ open: false, data: null });
            }}
            onCancel={() => setOpenDeleteAlert({ open: false, data: null })}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
