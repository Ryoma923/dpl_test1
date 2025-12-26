
import React from 'react';
import { Icons } from '../constants';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <Icons.Database />, label: '数据接口', active: false },
    { icon: <Icons.Play />, label: '生命周期', active: false },
    { icon: <Icons.Cloud />, label: 'SaaS 数据', active: true },
    { icon: <Icons.History />, label: '审计日志', active: false },
    { icon: <Icons.Database />, label: '凭据管理', active: false },
  ];

  return (
    <div className="flex h-full border-r border-gray-200 bg-white">
      {/* Icon Bar */}
      <div className="w-16 flex flex-col items-center py-4 gap-6 bg-[#2d3a54] text-white/70">
        <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold mb-4">
          DM
        </div>
        {menuItems.map((item, idx) => (
          <div key={idx} title={item.label} className={`p-2 rounded cursor-pointer transition-colors ${item.active ? 'text-white bg-blue-600/30' : 'hover:text-white hover:bg-white/10'}`}>
            {item.icon}
          </div>
        ))}
      </div>
      
      {/* List Bar */}
      <div className="w-60 flex flex-col bg-white">
        <div className="p-4 font-bold text-gray-700 border-b flex items-center justify-between">
          <span>资源目录</span>
          <button className="text-gray-400 hover:text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {['主工作流', '节点列表', '数据源管理', '条件分支', '映射规则', '操作日志'].map((item, idx) => (
            <div key={idx} className={`px-4 py-2.5 text-sm flex items-center justify-between group cursor-pointer ${idx === 2 ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-50"></div>
                 {item}
              </div>
              <Icons.ChevronRight />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
