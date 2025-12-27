import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserByHandler } from "@/api/DevTreeApi";
import HandleData from "@/components/HandleData";

export default function HandleView() {
  const params = useParams();
  const handle = params.handle!;
  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandler(handle),
    queryKey: ["getUserByHandler", handle],
    retry: 1,
  });

  if (isLoading) return "...cargando";
  if (error) return <Navigate to="/404" />;

  if (data) {
    return <HandleData data={data} />;
  }
}
