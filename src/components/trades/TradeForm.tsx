import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Trade } from "@/types";
import { tradeService } from "@/lib/api";
import { uploadScreenshot } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface TradeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  tradeToEdit?: Trade | null;
}

// Tipo auxiliar para el formulario
type TradeFormData = Omit<Trade, 'tags'> & { tags: string };

export function TradeForm({ open, onOpenChange, onSuccess, tradeToEdit }: TradeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, watch } = useForm<Partial<TradeFormData>>({
    defaultValues: {
      direction: 'long',
      status: 'closed',
      size: 1,
      commission: 0,
    }
  });

 useEffect(() => {
    if (tradeToEdit) {
      reset({
        ...tradeToEdit,
        tags: tradeToEdit.tags ? tradeToEdit.tags.join(", ") : "",
        entry_date: tradeToEdit.entry_date ? tradeToEdit.entry_date.split('T')[0] : '',
        exit_date: tradeToEdit.exit_date ? tradeToEdit.exit_date.split('T')[0] : '',
      });
      setPreviewUrl(tradeToEdit.screenshot_url || null);
    } else {
      reset({ direction: 'long', status: 'closed', size: 1, commission: 0 });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [tradeToEdit, reset, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let screenshotUrl = data.screenshot_url;

      if (selectedFile) {
        const url = await uploadScreenshot(selectedFile);
        if (url) screenshotUrl = url;
      }

      // Convertir tags string
      const tagsArray = data.tags 
        ? data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "") 
        : [];

      const payload = {
        ...data,
        entry_price: Number(data.entry_price),
        exit_price: Number(data.exit_price),
        size: Number(data.size),
        pnl: Number(data.pnl),
        commission: Number(data.commission),
        tags: tagsArray,
        screenshot_url: screenshotUrl,
        entry_date: data.entry_date 
          ? new Date(data.entry_date + 'T12:00:00').toISOString() 
          : new Date().toISOString(),
        
        exit_date: data.exit_date 
          ? new Date(data.exit_date + 'T12:00:00').toISOString() 
          : null,
      };

      if (tradeToEdit) {
        await tradeService.update(tradeToEdit.id, payload);
        toast.success("Trade actualizado");
      } else {
        await tradeService.create(payload);
        toast.success("Trade registrado exitosamente");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el trade");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-card border-l border-border text-foreground">
        <SheetHeader>
          <SheetTitle className="text-xl font-display font-bold">
            {tradeToEdit ? "Editar Operación" : "Registrar Nuevo Trade"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Símbolo</Label>
              <Input {...register("symbol", { required: true })} placeholder="NQ" className="uppercase bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Select 
                onValueChange={(val) => setValue("direction", val as 'long' | 'short')} 
                defaultValue={tradeToEdit?.direction || "long"}
              >
                <SelectTrigger className="bg-black/20">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long" className="text-profit">LONG (Compra)</SelectItem>
                  <SelectItem value="short" className="text-loss">SHORT (Venta)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Precio Entrada</Label>
              <Input type="number" step="0.00001" {...register("entry_price", { required: true })} className="bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>Precio Salida</Label>
              <Input type="number" step="0.00001" {...register("exit_price")} className="bg-black/20" />
            </div>
          </div>

          {/* Fila SIZE y COMMISSION */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tamaño (Size)</Label>
              <Input type="number" step="0.01" {...register("size", { required: true })} className="bg-black/20" placeholder="1.0" />
            </div>
            <div className="space-y-2">
              <Label>Comisión ($)</Label>
              <Input type="number" step="0.01" {...register("commission")} className="bg-black/20" placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>PnL Neto ($)</Label>
            <Input 
              type="number" 
              step="0.01" 
              {...register("pnl", { required: true })} 
              className={`bg-black/20 font-bold ${Number(watch('pnl')) >= 0 ? 'text-profit' : 'text-loss'}`}
              placeholder="0.00"
            />
          </div>

          {/* FECHAS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Entrada</Label>
              <Input type="date" {...register("entry_date", { required: true })} className="bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>Fecha Salida</Label>
              <Input type="date" {...register("exit_date")} className="bg-black/20" />
            </div>
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <Label>Etiquetas (Separadas por comas)</Label>
            <Input {...register("tags")} placeholder="scalping, fvg, news" className="bg-black/20" />
          </div>

          {/* FOTO */}
          <div className="space-y-2">
            <Label>Screenshot</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
              <Input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-md" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setValue('screenshot_url', '');
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <span className="text-xs">Click para subir imagen</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea {...register("notes")} className="bg-black/20" placeholder="¿Qué aprendiste de este trade?" />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tradeToEdit ? "Guardar Cambios" : "Registrar Trade"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}