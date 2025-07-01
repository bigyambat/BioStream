'use client'

import BaseNode from '@/components/nodes/BaseNode'
import RScriptNode from '@/components/nodes/RScriptNode'

const nodeTypes = {
  'r-script': RScriptNode,
  'data-source': BaseNode,
  'transform': BaseNode,
  'visualization': BaseNode,
  'control': BaseNode,
} as const;

export default nodeTypes 