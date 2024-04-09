import { useGetActivity } from "@/lib/react-query/queriesAndMutations";
import { getActionMessage, multiFormatDateString } from "@/lib/utils";
import Loader from "./Loader";

const Activity = () => {
  const { data: activity, isLoading } = useGetActivity();

  if (isLoading || !activity || !activity.documents) {
    return <Loader />;
  }
  return (
    <div className="hidden xl:min-h-full w-[30%] xl:flex flex-col items-center lg:px-4  lg:py-5">
      <div className="w-[100%] p-5 flex flex-col justify-center items-center rounded-2xl border border-slate-800 shadow-inner  shadow-slate-800 top-36 sticky">
        <h2 className="h3-bold sm:h3-bold">Activity</h2>
        <hr className="border my-5 w-full border-dark-4/80" />

        <div className="flex flex-col w-full mt-4 flex-1 gap-3">
          {activity?.documents?.map((eachDoc) => {
            return (
              <>
                <div className="flex items-center gap-2">
                  <img
                    src={eachDoc?.user?.imageUrl}
                    className="rounded-full w-10 h-10"
                    alt="profile"
                  />
                  <h2 className="text-[20px] text-light-2 font-bold">
                    {eachDoc?.user?.name}
                  </h2>
                  <p className="flex-1 text-light-3">
                    {getActionMessage(eachDoc?.activityMessage)}
                  </p>
                  <p className="text-light-3">
                    {multiFormatDateString(eachDoc?.$createdAt)}
                  </p>
                </div>
                <hr className="border w-full border-dark-4/80" />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Activity;
