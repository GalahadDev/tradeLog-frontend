import { useEffect, useState } from "react";
import { adminService, userService } from "@/lib/api";
import { User } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ShieldCheck, Loader2, Pencil, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const UsersAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const me = await userService.getMe();
      if (me.data.user.role !== 'admin') {
        toast.error("Acceso denegado");
        navigate("/dashboard");
        return;
      }
      loadUsers();
    } catch (error) {
      navigate("/");
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await adminService.getAllUsers();
      const sorted = data.users.sort((a, b) => Number(a.is_active) - Number(b.is_active));
      setUsers(sorted);
    } catch (error) {
      toast.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser({ ...user });
    setIsSheetOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      await adminService.updateUser(selectedUser.id, {
        role: selectedUser.role,
        is_active: selectedUser.is_active,
        full_name: selectedUser.full_name,
      });
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      toast.success("Usuario actualizado");
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Error al actualizar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success("Usuario eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary"/></div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* 2. BOTÓN VOLVER */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")} 
            className="mb-4 hover:bg-white/5 text-muted-foreground hover:text-foreground gap-2 pl-0"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Button>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-2">
                <Shield className="w-8 h-8 text-purple-400" />
                Panel de Administración
              </h1>
              <p className="text-muted-foreground mt-1">Gestión de usuarios y permisos del sistema</p>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Verificado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleEditClick(user)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={user.avatar_url || "https://github.com/shadcn.png"} className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{user.full_name || "Sin nombre"}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-profit' : 'bg-yellow-500'}`} />
                        <span className={`text-xs ${user.is_active ? 'text-profit' : 'text-yellow-500'}`}>
                          {user.is_active ? 'Activo' : 'Pendiente'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.is_verified ? <ShieldCheck className="w-4 h-4 text-profit" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}>
                          <Pencil className="w-4 h-4 text-muted-foreground hover:text-white" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => handleDelete(user.id, e)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* SHEET DE EDICIÓN */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="border-l border-border bg-card text-foreground">
            <SheetHeader>
              <SheetTitle>Editar Usuario</SheetTitle>
              <SheetDescription>Modifica permisos de {selectedUser?.email}</SheetDescription>
            </SheetHeader>
            {selectedUser && (
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input 
                    value={selectedUser.full_name || ''} 
                    onChange={(e) => setSelectedUser({...selectedUser, full_name: e.target.value})}
                    className="bg-black/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(val: 'admin' | 'user') => setSelectedUser({...selectedUser, role: val})}
                  >
                    <SelectTrigger className="bg-black/20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="admin" className="text-purple-400 font-bold">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                   <div className="space-y-0.5"><Label>Acceso</Label></div>
                   <Switch 
                     checked={selectedUser.is_active}
                     onCheckedChange={(val) => setSelectedUser({...selectedUser, is_active: val})}
                   />
                </div>
              </div>
            )}
            <SheetFooter>
              <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full bg-primary">{isSaving && <Loader2 className="mr-2 animate-spin" />} Guardar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
};

export default UsersAdmin;