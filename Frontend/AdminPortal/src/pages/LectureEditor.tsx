import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { lectureService, LectureDto } from '../services/adminService';
import { lectureContentService } from '../services/lectureContentService';
import EditorHeader from '../components/editor/EditorHeader';
import EditorSidebar from '../components/editor/EditorSidebar';
import BlockRenderer from '../components/editor/BlockRenderer';
import { showToast } from '../components/ui/Toast';
import { Loader2 } from 'lucide-react';

export interface Block {
  id: string;
  lectureId: string;
  blockType: string;
  dataJson: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function LectureEditor() {
  const { lectureId: lectureIdFromParams } = useParams<{ lectureId?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lectureIdFromQuery = searchParams.get('lectureId');
  const lectureId = lectureIdFromParams || lectureIdFromQuery || '';
  const sectionId = searchParams.get('sectionId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [lecture, setLecture] = useState<LectureDto | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null);
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blocksRef = useRef<Block[]>([]);

  // Load lecture and blocks
  useEffect(() => {
    if (lectureId) {
      loadLectureData(lectureId);
    } else {
      setLoading(false);
    }
  }, [lectureId]);

  // Update ref when blocks change
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const loadLectureData = async (id: string) => {
    try {
      setLoading(true);
      
      // Load lecture
      const lectureRes = await lectureService.getById(id);
      if (lectureRes.success && lectureRes.data) {
        setLecture(lectureRes.data);
        console.log('Loaded lecture:', lectureRes.data);
      } else {
        console.error('Failed to load lecture:', lectureRes);
      }

      // Load blocks
      const blocksRes = await lectureContentService.getByLectureId(id);
      console.log('Blocks response:', blocksRes);
      
      // Handle different response structures
      let blocksData: any[] = [];
      if (blocksRes.success) {
        // Try different response structures
        if (Array.isArray(blocksRes.data)) {
          blocksData = blocksRes.data;
        } else if (blocksRes.data?.data && Array.isArray(blocksRes.data.data)) {
          blocksData = blocksRes.data.data;
        } else if (blocksRes.data?.items && Array.isArray(blocksRes.data.items)) {
          blocksData = blocksRes.data.items;
        }
      }
      
      console.log('Parsed blocks data:', blocksData);
      
      if (blocksData.length > 0) {
        const sortedBlocks = blocksData.sort((a: Block, b: Block) => a.orderIndex - b.orderIndex);
        setBlocks(sortedBlocks);
        console.log('Set blocks:', sortedBlocks);
      } else {
        setBlocks([]);
        console.log('No blocks found for lecture:', id);
      }
    } catch (error: any) {
      showToast('Failed to load lecture data', 'error');
      console.error('Error loading lecture data:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save with debounce
  const saveBlock = useCallback(async (blockId: string, dataJson: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaving(true);
    setSaved(false);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await lectureContentService.updateBlockJson(blockId, { dataJson });
        setSaved(true);
        setSaving(false);
      } catch (error: any) {
        showToast('Failed to save block', 'error');
        setSaving(false);
      }
    }, 800);
  }, []);

  // Create new block
  const handleCreateBlock = async (afterBlockId: string | null, blockType: string, initialData?: any) => {
    if (!lectureId) return;

    try {
      const afterBlock = afterBlockId 
        ? blocksRef.current.find(b => b.id === afterBlockId)
        : null;
      
      const newOrderIndex = afterBlock 
        ? afterBlock.orderIndex + 1 
        : blocksRef.current.length > 0 
          ? Math.max(...blocksRef.current.map(b => b.orderIndex)) + 1
          : 0;

      const initialJson = initialData ? JSON.stringify(initialData) : '{}';

      const result = await lectureContentService.create({
        lectureId,
        blockType,
        dataJson: initialJson,
        orderIndex: newOrderIndex,
      });

      if (result.success && result.data) {
        const newBlock: Block = {
          id: result.data.id,
          lectureId: result.data.lectureId,
          blockType: result.data.blockType,
          dataJson: result.data.dataJson,
          orderIndex: result.data.orderIndex,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
        };

        setBlocks(prev => {
          const updated = [...prev, newBlock].sort((a: Block, b: Block) => a.orderIndex - b.orderIndex);
          return updated;
        });

        setSelectedBlockId(newBlock.id);
        return newBlock.id;
      }
    } catch (error: any) {
      showToast('Failed to create block', 'error');
    }
    return null;
  };

  // Update block
  const handleUpdateBlock = async (blockId: string, updates: { blockType?: string; dataJson?: string; orderIndex?: number }) => {
    try {
      const result = await lectureContentService.update(blockId, updates);
      if (result.success && result.data) {
        setBlocks(prev => prev.map(b => 
          b.id === blockId 
            ? { ...b, ...result.data, dataJson: updates.dataJson || b.dataJson }
            : b
        ).sort((a, b) => a.orderIndex - b.orderIndex));
      }
    } catch (error: any) {
      showToast('Failed to update block', 'error');
    }
  };

  // Delete block
  const handleDeleteBlock = async (blockId: string) => {
    try {
      const result = await lectureContentService.delete(blockId);
      if (result.success) {
        setBlocks(prev => prev.filter(b => b.id !== blockId));
        setSelectedBlockId(null);
      }
    } catch (error: any) {
      showToast('Failed to delete block', 'error');
    }
  };

  // Reorder blocks
  const handleReorderBlocks = async (newOrder: { blockId: string; orderIndex: number }[]) => {
    if (!lectureId) return;

    try {
      const result = await lectureContentService.reorderBlocks({
        lectureId,
        blocks: newOrder.map(item => ({
          blockId: item.blockId,
          orderIndex: item.orderIndex,
        })),
      });

      if (result.success) {
        // Update local state
        setBlocks(prev => {
          const updated = prev.map(block => {
            const orderItem = newOrder.find(o => o.blockId === block.id);
            return orderItem ? { ...block, orderIndex: orderItem.orderIndex } : block;
          });
          return updated.sort((a, b) => a.orderIndex - b.orderIndex);
        });
      }
    } catch (error: any) {
      showToast('Failed to reorder blocks', 'error');
    }
  };

  // Handle block content change (auto-save)
  const handleBlockContentChange = (blockId: string, dataJson: string) => {
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, dataJson } : b
    ));
    saveBlock(blockId, dataJson);
  };

  // Handle Enter key - create new block below
  const handleEnterKey = (blockId: string) => {
    const block = blocksRef.current.find(b => b.id === blockId);
    if (block) {
      handleCreateBlock(blockId, 'Text', { text: '' });
    }
  };

  // Handle Backspace - delete if empty
  const handleBackspace = (blockId: string, isEmpty: boolean) => {
    if (isEmpty) {
      const blockIndex = blocksRef.current.findIndex(b => b.id === blockId);
      if (blockIndex > 0) {
        handleDeleteBlock(blockId);
        setSelectedBlockId(blocksRef.current[blockIndex - 1].id);
      } else if (blocksRef.current.length === 1) {
        // Keep at least one block
        return;
      } else {
        handleDeleteBlock(blockId);
      }
    }
  };

  // Handle slash command
  const handleSlashCommand = (blockId: string) => {
    setShowBlockMenu(blockId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!lectureId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content Editor</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please select a lecture to edit content. You can navigate from the Lectures page or add <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">?lectureId=xxx</code> to the URL.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/lectures')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Lectures
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Lecture not found</p>
          <button
            onClick={() => navigate('/lectures')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to Lectures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <EditorHeader
        lecture={lecture}
        saving={saving}
        saved={saved}
        onBack={() => navigate(sectionId ? `/sections?sectionId=${sectionId}` : '/lectures')}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12 pr-24">
            {/* Placeholder CSS */}
            <style>{`
              [contenteditable][data-placeholder]:empty:before {
                content: attr(data-placeholder);
                color: rgb(156 163 175);
              }
            `}</style>
            {/* Blocks */}
            <div className="space-y-3">
              {blocks.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 mb-4">No content blocks yet</p>
                  <button
                    onClick={() => handleCreateBlock(null, 'Text', { text: '' })}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add First Block
                  </button>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onContentChange={(dataJson: string) => handleBlockContentChange(block.id, dataJson)}
                    onTypeChange={(blockType: string) => handleUpdateBlock(block.id, { blockType })}
                    onDelete={() => handleDeleteBlock(block.id)}
                    onEnter={() => handleEnterKey(block.id)}
                    onBackspace={(isEmpty: boolean) => handleBackspace(block.id, isEmpty)}
                    onSlashCommand={() => handleSlashCommand(block.id)}
                    showBlockMenu={showBlockMenu === block.id}
                    onBlockMenuSelect={(blockType: string) => {
                      handleUpdateBlock(block.id, { blockType });
                      setShowBlockMenu(null);
                    }}
                    onBlockMenuClose={() => setShowBlockMenu(null)}
                    onReorder={(newOrder: { blockId: string; orderIndex: number }[]) => handleReorderBlocks(newOrder)}
                    blocks={blocks}
                  />
                ))
              )}
            </div>

            {/* Add Block Button */}
            {blocks.length > 0 && (
              <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => handleCreateBlock(blocks[blocks.length - 1].id, 'Text', { text: '' })}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors"
                  >
                  + Add Block
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <EditorSidebar
          blocks={blocks}
          lecture={lecture}
          onBlockSelect={(blockId: string) => {
            setSelectedBlockId(blockId);
            document.getElementById(`block-${blockId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
      </div>
    </div>
  );
}

