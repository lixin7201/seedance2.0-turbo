'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Pencil } from 'lucide-react';

interface ModelConfig {
  id: string;
  displayName: string;
  description: string | null;
  currentProvider: string;
  providerModelId: string;
  enabled: boolean;
  verified: boolean;
  supportedModes: string[];
  parameters: any;
  creditsCost: Record<string, number> | null;
  tags: string[] | null;
  priority: number;
  providerModelMap: Record<string, string> | null;
}

const PROVIDER_OPTIONS = [
  { value: 'evolink', label: 'EvoLink' },
  { value: 'fal', label: 'Fal.ai' },
  { value: 'replicate', label: 'Replicate' },
  { value: 'kie', label: 'Kie.ai' },
  { value: 'gemini', label: 'Gemini' },
];

export default function ModelConfigPage() {
  const t = useTranslations('admin.settings');
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  
  // Edit Dialog State
  const [editingModel, setEditingModel] = useState<ModelConfig | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    providerModelMap: string;
    parameters: string;
  }>({ providerModelMap: '{}', parameters: '{}' });

  useEffect(() => {
    fetchModels();
  }, [showAll]);

  const fetchModels = async () => {
    try {
      const url = showAll ? '/api/admin/model-config?showAll=true' : '/api/admin/model-config';
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 0) {
        setModels(data.data || []);
      }
    } catch (e: any) {
      toast.error('Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  const updateModel = async (id: string, updates: Partial<ModelConfig>) => {
    try {
      const res = await fetch('/api/admin/model-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.code === 0) {
        toast.success('Model updated');
        fetchModels();
        return true;
      } else {
        toast.error(data.message || 'Update failed');
        return false;
      }
    } catch (e: any) {
      toast.error('Update failed');
      return false;
    }
  };

  const handleProviderChange = (modelId: string, provider: string) => {
    updateModel(modelId, { currentProvider: provider });
  };

  const handleEnabledChange = (modelId: string, enabled: boolean) => {
    updateModel(modelId, { enabled });
  };

  const handleVerifiedChange = (modelId: string, verified: boolean) => {
    updateModel(modelId, { verified });
  };

  const openEditDialog = (model: ModelConfig) => {
    setEditingModel(model);
    setEditForm({
      providerModelMap: JSON.stringify(model.providerModelMap || {}, null, 2),
      parameters: JSON.stringify(model.parameters || {}, null, 2),
    });
    setJsonError(null);
    setDialogOpen(true);
  };

  const validateAndSave = async () => {
    if (!editingModel) return;

    try {
      let parsedMap = null;
      let parsedParams = null;

      try {
        parsedMap = JSON.parse(editForm.providerModelMap);
      } catch (e) {
        setJsonError('Invalid JSON in Provider Model Map');
        return;
      }

      try {
        parsedParams = JSON.parse(editForm.parameters);
      } catch (e) {
        setJsonError('Invalid JSON in Parameters');
        return;
      }

      const success = await updateModel(editingModel.id, {
        providerModelMap: parsedMap,
        parameters: parsedParams,
      });

      if (success) {
        setDialogOpen(false);
      }
    } catch (e) {
      setJsonError('Validation failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Model Configuration</h2>
          <p className="text-muted-foreground">
            Manage AI models and their API provider mappings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="show-all" className="text-sm text-muted-foreground">Show All</Label>
          <Switch
            id="show-all"
            checked={showAll}
            onCheckedChange={setShowAll}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Model</TableHead>
              <TableHead className="w-[150px]">Provider</TableHead>
              <TableHead>Supported Modes</TableHead>
              <TableHead>Credits Cost</TableHead>
              <TableHead className="w-[100px]">Verified</TableHead>
              <TableHead className="w-[100px]">Enabled</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No models configured. Run the seed script to add initial models.
                </TableCell>
              </TableRow>
            ) : (
              models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.displayName}</span>
                      <span className="text-xs text-muted-foreground">{model.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={model.currentProvider}
                      onValueChange={(v) => handleProviderChange(model.id, v)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {model.supportedModes.map((mode) => (
                        <Badge key={mode} variant="secondary" className="text-xs">
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap text-sm">
                      {model.creditsCost && Object.entries(model.creditsCost).map(([mode, cost]) => (
                        <span key={mode} className="text-muted-foreground">
                          {mode.split('-').pop()}: {cost}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={model.verified}
                      onCheckedChange={(checked) => handleVerifiedChange(model.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={model.enabled}
                      onCheckedChange={(checked) => handleEnabledChange(model.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(model)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Model Configuration</DialogTitle>
            <DialogDescription>
              Modify advanced settings for {editingModel?.displayName} ({editingModel?.id})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="provider-map">Provider Model Mapping (JSON)</Label>
              <Textarea
                id="provider-map"
                className="font-mono text-sm min-h-[150px]"
                value={editForm.providerModelMap}
                onChange={(e) => setEditForm(prev => ({ ...prev, providerModelMap: e.target.value }))}
                placeholder='{ "fal": "fal-ai/fast-svd", "evolink": "flux-pro" }'
              />
              <p className="text-xs text-muted-foreground">
                Map provider names (e.g., 'fal', 'evolink') to their specific model IDs.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parameters">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                className="font-mono text-sm min-h-[100px]"
                value={editForm.parameters}
                onChange={(e) => setEditForm(prev => ({ ...prev, parameters: e.target.value }))}
              />
            </div>

            {jsonError && (
              <div className="text-sm text-destructive font-medium">
                Error: {jsonError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={validateAndSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
