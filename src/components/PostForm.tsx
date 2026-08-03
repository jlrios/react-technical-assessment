import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

export interface PostFormData {
  title: string;
  body: string;
}

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
  onCancel: () => void;
  initialData?: PostFormData;
}

const PostForm = ({ onSubmit, onCancel, initialData }: PostFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label>Título</label>
        <InputText
          className="w-full"
          {...register("title", {
            required: "El título es obligatorio",
          })}
        />
        {errors.title && (
          <small className="p-error">{errors.title.message}</small>
        )}
      </div>
      <div className="field mt-3">
        <label>Contenido</label>
        <InputTextarea
          rows={5}
          className="w-full"
          {...register("body", {
            required: "El contenido es obligatorio",
          })}
        />
        {errors.body && (
          <small className="p-error">{errors.body.message}</small>
        )}
      </div>
      <div className="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          onClick={onCancel}
        />
        <Button type="submit" label="Guardar" />
      </div>
    </form>
  );
};

export default PostForm;
