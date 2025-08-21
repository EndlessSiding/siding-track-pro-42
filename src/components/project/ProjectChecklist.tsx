
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { ProjectChecklistItem } from "@/types/project";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectChecklistProps {
  checklist: ProjectChecklistItem[];
  onUpdateChecklist: (checklist: ProjectChecklistItem[]) => void;
  readonly?: boolean;
}

export default function ProjectChecklist({ checklist = [], onUpdateChecklist, readonly = false }: ProjectChecklistProps) {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ title: "", description: "" });

  const completedItems = checklist.filter(item => item.completed).length;
  const totalItems = checklist.length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;

    const item: ProjectChecklistItem = {
      id: Date.now().toString(),
      title: newItem.title.trim(),
      description: newItem.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onUpdateChecklist([...checklist, item]);
    setNewItem({ title: "", description: "" });
    setIsAdding(false);
  };

  const handleToggleItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateChecklist(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = checklist.filter(item => item.id !== id);
    onUpdateChecklist(updated);
  };

  const handleEditItem = (id: string, title: string, description?: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, title, description } : item
    );
    onUpdateChecklist(updated);
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Checklist do Projeto
            <Badge variant="outline">
              {completedItems}/{totalItems}
            </Badge>
          </CardTitle>
          {!readonly && (
            <Button onClick={() => setIsAdding(true)} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          )}
        </div>
        {totalItems > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Add new item form */}
        {isAdding && (
          <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
            <Input
              placeholder="Título do item"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Textarea
              placeholder="Descrição (opcional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={2}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddItem} size="sm">
                <Check className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
              <Button onClick={() => setIsAdding(false)} size="sm" variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Checklist items */}
        {checklist.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum item no checklist ainda.</p>
            {!readonly && (
              <Button onClick={() => setIsAdding(true)} variant="outline" className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeiro item
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {checklist.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                onToggle={() => handleToggleItem(item.id)}
                onEdit={(title, description) => handleEditItem(item.id, title, description)}
                onDelete={() => handleDeleteItem(item.id)}
                onStartEdit={() => setEditingId(item.id)}
                onCancelEdit={() => setEditingId(null)}
                readonly={readonly}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ChecklistItemProps {
  item: ProjectChecklistItem;
  isEditing: boolean;
  onToggle: () => void;
  onEdit: (title: string, description?: string) => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  readonly?: boolean;
}

function ChecklistItem({ 
  item, 
  isEditing, 
  onToggle, 
  onEdit, 
  onDelete, 
  onStartEdit, 
  onCancelEdit,
  readonly = false 
}: ChecklistItemProps) {
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDescription, setEditDescription] = useState(item.description || "");

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onEdit(editTitle.trim(), editDescription.trim());
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Título do item"
        />
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          rows={2}
        />
        <div className="flex gap-2">
          <Button onClick={handleSaveEdit} size="sm">
            <Check className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button onClick={onCancelEdit} size="sm" variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
      item.completed ? 'bg-muted/30 border-muted' : 'bg-background hover:bg-muted/20'
    }`}>
      <Checkbox
        checked={item.completed}
        onCheckedChange={onToggle}
        disabled={readonly}
        className="mt-0.5"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
          {item.title}
        </h4>
        {item.description && (
          <p className={`text-sm mt-1 ${item.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
            {item.description}
          </p>
        )}
      </div>

      {!readonly && (
        <div className="flex gap-1">
          <Button onClick={onStartEdit} size="sm" variant="ghost">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button onClick={onDelete} size="sm" variant="ghost" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
