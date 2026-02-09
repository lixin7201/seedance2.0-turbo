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

interface ModelConfig {
  id: string;
  displayName: string;
  description: string | null;
  currentProvider: string;
  providerModelId: string;
  enabled: boolean;
  supportedModes: string[];
  parameters: any;
  creditsCost: Record<string, number> | null;
  tags: string[] | null;
  priority: number;
}

const PROVIDER_OPTIONS = [
  { value: 'evolink', label: 'EvoLink' },
  { value: 'fal', label: 'Fal.ai' },
  { value: 'replicate', label: 'Replicate' },
  { value: 'kie', label: 'Kie.ai' },
];

export default function ModelConfigPage() {
  const t = useTranslations('admin.settings');
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/admin/model-config');
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
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (e: any) {
      toast.error('Update failed');
    }
  };

  const handleProviderChange = (modelId: string, provider: string) => {
    updateModel(modelId, { currentProvider: provider });
  };

  const handleEnabledChange = (modelId: string, enabled: boolean) => {
    updateModel(modelId, { enabled });
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Model Configuration</h2>
        <p className="text-muted-foreground">
          Manage AI models and their API provider mappings
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Model</TableHead>
              <TableHead className="w-[150px]">Provider</TableHead>
              <TableHead>Supported Modes</TableHead>
              <TableHead>Credits Cost</TableHead>
              <TableHead className="w-[100px]">Enabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
                      checked={model.enabled}
                      onCheckedChange={(checked) => handleEnabledChange(model.id, checked)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
