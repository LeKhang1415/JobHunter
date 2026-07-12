import { useState, useEffect } from "react";
import {
  createSelfSubscriber,
  deleteSelfSubscriber,
  findSelfSubscriber,
  updateSelfSubscriber,
} from "@/services/subscriberApi";
import type { DefaultSubscriberResponseDto, DefaultSubscriberRequestDto } from "@/types/subscriber.type";
import type { SkillSummary } from "@/types/job.type";
import { toast } from "sonner";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { Button } from "@/components/ui/button";
import { Loader2, BellRing, CheckCircle2, Wrench, Edit, Trash2, User, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SkillSelection from "@/pages/commons/SkillSelection";

export default function NotificationsPage() {
  const [subscriber, setSubscriber] =
    useState<DefaultSubscriberResponseDto | null>(null);

  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState<SkillSummary[]>([]);

  const fetchSubscriber = async () => {
    try {
      setIsChecking(true);
      const res = await findSelfSubscriber();
      const subscriberData = res.data.result;
      setSubscriber(subscriberData);

      if (subscriberData?.skills) {
        setSelectedSkills(
          subscriberData.skills.map((skill: SkillSummary) => ({
            id: skill.id,
            name: skill.name,
          })),
        );
      }
    } catch {
      setSubscriber(null);
      setSelectedSkills([]);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchSubscriber();
  }, []);

  const handleCreateOrUpdateSubscriber = async () => {
    if (selectedSkills.length === 0) {
      toast.error("Vui lòng chọn ít nhất một kỹ năng");
      return;
    }

    try {
      setIsLoading(true);

      const data: DefaultSubscriberRequestDto = {
        skills: selectedSkills.map((s) => s.id),
      };

      let res;
      const isUpdate = !!subscriber;

      if (isUpdate) {
        res = await updateSelfSubscriber(data);
        toast.success("Cập nhật đăng ký thành công");
      } else {
        res = await createSelfSubscriber(data);
        toast.success("Đăng ký nhận thông báo thành công");
      }

      setSubscriber(res.data.result);
      setIsEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteSelfSubscriber();
      setSubscriber(null);
      setSelectedSkills([]);
      setIsEditing(false);
      toast.success("Hủy đăng ký thành công");
    } catch (err) {
      toast.error(getErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setIsLoading(false);
    }
  };

  const removeSkill = (skill: SkillSummary) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (subscriber?.skills) {
      setSelectedSkills(
        subscriber.skills.map((skill: SkillSummary) => ({
          id: skill.id,
          name: skill.name,
        }))
      );
    } else {
      setSelectedSkills([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Đăng ký nhận thông báo việc làm
        </h1>
        <p className="text-gray-500">
          Nhận thông báo về các công việc phù hợp với kỹ năng của bạn
        </p>
      </div>

      {isChecking ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : isEditing ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-gray-800" />
            <h2 className="text-lg font-semibold text-gray-800">
              {subscriber ? "Chỉnh sửa đăng ký" : "Tạo đăng ký nhận thông báo"}
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Cập nhật kỹ năng để nhận thông báo phù hợp hơn
          </p>

          <div className="bg-gray-50 text-gray-600 text-sm p-4 rounded-lg flex items-start gap-3 mb-6 border border-gray-100">
            <BellRing className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Chọn các kỹ năng mà bạn quan tâm. Hệ thống sẽ gửi thông báo khi có công việc yêu cầu những kỹ năng này.
            </p>
          </div>

          <div className="mb-6">
            <SkillSelection
              selectedSkills={selectedSkills}
              onRemoveSkill={removeSkill}
              onApplySkills={setSelectedSkills}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              className="bg-black hover:bg-gray-800 text-white"
              onClick={handleCreateOrUpdateSubscriber}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {subscriber ? "Cập nhật" : "Đăng ký"}
            </Button>
            <Button
              variant="outline"
              className="border-gray-200"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              Hủy
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          {subscriber ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-800">Trạng thái đăng ký</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Bạn đang nhận thông báo cho các kỹ năng sau
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-sm text-gray-800">Kỹ năng đã đăng ký ({selectedSkills.length})</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="bg-green-50 text-green-600 hover:bg-green-100 border-none font-medium px-3 py-1"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Hủy đăng ký
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <BellRing className="text-gray-400 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-800">Trạng thái đăng ký</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Bạn chưa đăng ký nhận thông báo nào.
              </p>

              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <BellRing className="w-4 h-4 mr-2" />
                Đăng ký nhận thông báo
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
