import ErrorMessage from "./ErrorMessage";
import slugify from "react-slugify";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { searchByHandle } from "@/api/DevTreeApi";

export default function SearchForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      handle: "",
    },
  });

  const mutation = useMutation({
    mutationFn: searchByHandle,
  });
  const { data, isPending, isError, error } = mutation;
  const handle = watch("handle");
  const handleSearch = () => {
    const slug = slugify(handle);
    mutation.mutate(slug);
  };

  return (
    <form onSubmit={handleSubmit(handleSearch)} className="space-y-5">
      <div className="relative flex items-center  bg-white  px-2">
        <label htmlFor="handle">devtree.com/</label>
        <input
          type="text"
          id="handle"
          className="border-none bg-transparent p-2 focus:ring-0 flex-1"
          placeholder="elonmusk, zuck, jeffbezos"
          {...register("handle", {
            required: "Un Nombre de Usuario es obligatorio",
          })}
        />
      </div>
      {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}

      <div className="mt-10">
        {isPending && <p className="text-center">Buscando...</p>}
        {isError && <p className="text-center text-red-500">{error.message}</p>}
        {data && (
          <p className="text-center text-cyan-600">
            El usuario {data[0]} esta disponible
          </p>
        )}
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        value="Obtener mi DevTree"
      />
    </form>
  );
}
