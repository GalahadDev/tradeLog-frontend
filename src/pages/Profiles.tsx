import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { userService } from "@/lib/api";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, ArrowLeft } from "lucide-react"; 
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Profile = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await userService.getMe();
      setUser(data.user);
    } catch (error) {
      toast.error("Error cargando perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await userService.updateMe({
        full_name: user.full_name,
        phone_number: user.phone_number,
        bio: user.bio,
        trading_experience: user.trading_experience,
      });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto relative z-10">

          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")} 
            className="mb-4 hover:bg-white/5 text-muted-foreground hover:text-foreground gap-2 pl-0"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-6 mb-8 border-b border-border/50 pb-8">
              <div className="relative">
                <img 
                  src={user?.avatar_url || "https://github.com/shadcn.png"} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-2 border-primary shadow-glow-primary object-cover"
                />
                {user?.is_verified && (
                  <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full text-xs" title="Verificado">✓</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-foreground">{user?.full_name || "Sin Nombre"}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-bold">
                    {user?.role.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${user?.is_active ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}`}>
                    {user?.is_active ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input 
                    value={user?.full_name || ''} 
                    onChange={e => setUser({...user!, full_name: e.target.value})}
                    className="bg-black/20 border-white/10 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input 
                    value={user?.phone_number || ''} 
                    onChange={e => setUser({...user!, phone_number: e.target.value})}
                    className="bg-black/20 border-white/10 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Experiencia en Trading</Label>
                <Select 
                  value={user?.trading_experience || ''} 
                  onValueChange={(value) => setUser({...user!, trading_experience: value})}
                >
                  <SelectTrigger className="w-full bg-black/20 border-white/10 focus:ring-primary">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Beginner">Principiante</SelectItem>
                    <SelectItem value="Intermediate">Intermedio</SelectItem>
                    <SelectItem value="Pro">Profesional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Biografía</Label>
                <Textarea 
                  value={user?.bio || ''} 
                  onChange={e => setUser({...user!, bio: e.target.value})}
                  className="bg-black/20 border-white/10 min-h-[100px] focus:border-primary"
                  placeholder="Describe tu estrategia o filosofía de trading..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/80 text-primary-foreground min-w-[150px]">
                  {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;