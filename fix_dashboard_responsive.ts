import fs from 'fs';

const filePath = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Categories Table to Cards
const catTableMatch = /<div className="overflow-x-auto no-scrollbar">[\s\S]*?<table className="w-full text-left">[\s\S]*?<\/table>[\s\S]*?<\/div>/;
const catTableReplacement = `<div className="hidden md:block overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                     <thead>
                       <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                         <td className="px-10 py-6">Nome / Contexto</td>
                         <td className="px-10 py-6">Slug Estrutural</td>
                         <td className="px-10 py-6">SEO Health</td>
                         <td className="px-10 py-6 text-right">Ação</td>
                       </tr>
                     </thead>
                    <tbody className="divide-y-4 divide-white">
                      {loadingCategories ? (
                         Array.from({ length: 5 }).map((_, i) => (
                           <tr key={\`skel-cat-\${i}\`}>
                             <td className="px-10 py-10">
                               <div className="flex items-center gap-6">
                                 <Skeleton variant="circular" className="w-4 h-4" />
                                 <div className="space-y-2">
                                   <Skeleton variant="rectangular" className="h-6 w-48" />
                                   <Skeleton variant="text" className="w-64" />
                                 </div>
                               </div>
                             </td>
                             <td className="px-10 py-10"><Skeleton variant="rectangular" className="h-8 w-32" /></td>
                             <td className="px-10 py-10"><Skeleton variant="rectangular" className="h-4 w-16 mx-auto" /></td>
                             <td className="px-10 py-10 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                           </tr>
                         ))
                       ) : categories.map((cat) => (
                        <tr key={cat.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-10 py-10">
                            <div className="flex items-center gap-6">
                              <div className={\`w-4 h-4 rounded-full \${cat.isProtected ? 'bg-brand-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 'bg-slate-100'} transition-all duration-700 group-hover:scale-125\`}></div>
                              <div>
                                <span className="text-xl font-black text-slate-900 block leading-tight tracking-tighter group-hover:text-brand-600 transition-colors uppercase">{cat.name}</span>
                                <span className="text-[12px] font-bold text-slate-300 block truncate max-w-[400px] tracking-tight mt-1 uppercase opacity-60 group-hover:opacity-100">{cat.description || 'Nenhum contexto estratégico definido'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-10">
                            <span className="text-[10px] font-black text-slate-400 font-mono tracking-[0.1em] bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white group-hover:text-slate-900 transition-all">/blog/{cat.slug}</span>
                          </td>
                          <td className="px-10 py-10 text-center">
                            <div className="flex justify-center gap-4">
                              <div className={\`w-3 h-3 rounded-full border-2 border-white shadow-xl \${cat.seoTitle ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-100'}\`} title="Title SEO"></div>
                              <div className={\`w-3 h-3 rounded-full border-2 border-white shadow-xl \${cat.seoDescription ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-100'}\`} title="Meta Description"></div>
                            </div>
                          </td>
                          <td className="px-10 py-10 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                              <button 
                                onClick={() => {
                                  setCategoryForm(cat);
                                  setShowCategoryForm(true);
                                }}
                                className="p-4 text-slate-300 hover:text-slate-900 bg-white border border-slate-100 rounded-2xl transition-all shadow-xl shadow-slate-100 hover:shadow-2xl active:scale-95"
                              >
                                <Edit3 size={18} />
                              </button>
                              {!cat.isProtected && (
                                <button 
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="p-4 text-slate-300 hover:text-rose-500 bg-white border border-slate-100 rounded-2xl transition-all shadow-xl shadow-slate-100 hover:shadow-2xl active:scale-95"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-24 text-slate-300 uppercase text-[10px] font-bold tracking-[0.2em]">Sem categorias ativas</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-4">
                   {loadingCategories ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={\`skel-cat-mob-\${i}\`} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                          <Skeleton variant="rectangular" className="h-6 w-3/4 rounded-lg" />
                          <Skeleton variant="text" className="w-full" />
                          <div className="flex justify-between items-center pt-4">
                            <Skeleton variant="rectangular" className="h-8 w-24 rounded-lg" />
                            <Skeleton variant="circular" className="h-8 w-8" />
                          </div>
                        </div>
                      ))
                   ) : categories.length === 0 ? (
                      <div className="p-12 text-center text-slate-300 uppercase text-[10px] font-bold tracking-widest bg-slate-50 rounded-3xl border border-dashed border-slate-200">Sem categorias</div>
                   ) : categories.map((cat) => (
                      <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 group">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className={\`w-3 h-3 rounded-full \${cat.isProtected ? 'bg-brand-500' : 'bg-slate-100'}\`}></div>
                             <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{cat.name}</h4>
                          </div>
                          <div className="flex gap-2">
                             <div className={\`w-2 h-2 rounded-full \${cat.seoTitle ? 'bg-emerald-500' : 'bg-slate-200'}\`}></div>
                             <div className={\`w-2 h-2 rounded-full \${cat.seoDescription ? 'bg-emerald-500' : 'bg-slate-200'}\`}></div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{cat.description || 'Sem descrição'}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                           <span className="text-[10px] font-bold text-brand-600 font-mono tracking-tighter bg-brand-50 px-3 py-1 rounded-lg">/{cat.slug}</span>
                           <div className="flex gap-2">
                              <button onClick={() => { setCategoryForm(cat); setShowCategoryForm(true); }} className="p-3 bg-slate-50 text-slate-400 rounded-xl active:scale-95 transition-all"><Edit3 size={16} /></button>
                              {!cat.isProtected && <button onClick={() => handleDeleteCategory(cat)} className="p-3 bg-rose-50 text-rose-400 rounded-xl active:scale-95 transition-all"><Trash2 size={16} /></button>}
                           </div>
                        </div>
                      </div>
                   ))}
                </div>`;

const newContent1 = content.replace(catTableMatch, catTableReplacement);
if (newContent1 !== content) {
    console.log('Categories table replaced.');
    content = newContent1;
}

// 2. Clients Table to Cards
const clientsTableMatch = /<div className="overflow-x-auto no-scrollbar rounded-\[24px\] border border-slate-100 bg-white">[\s\S]*?<table className="w-full text-left">[\s\S]*?<\/table>[\s\S]*?<\/div>/;
const clientsTableReplacement = `<div className="hidden md:block overflow-x-auto no-scrollbar rounded-[24px] border border-slate-100 bg-white">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                        <td className="px-8 py-5">Parceiro / Ativo Digital</td>
                        <td className="px-8 py-5 text-center">Acesso ao Portal</td>
                        <td className="px-8 py-5">Gestão Operacional</td>
                        <td className="px-8 py-5 text-right">Controle</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingClients ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={\`skel-client-\${i}\`}>
                            <td className="px-8 py-6">
                              <Skeleton variant="rectangular" className="h-6 w-48 mb-2" />
                              <Skeleton variant="text" className="w-32" />
                            </td>
                            <td className="px-8 py-6 text-center"><Skeleton variant="rectangular" className="h-6 w-24 mx-auto" /></td>
                            <td className="px-8 py-6"><Skeleton variant="rectangular" className="h-10 w-40" /></td>
                            <td className="px-8 py-6 text-right"><Skeleton variant="rectangular" className="h-8 w-16 ml-auto" /></td>
                          </tr>
                        ))
                      ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-20 text-slate-300 uppercase text-[10px] font-bold tracking-[0.15em]">Fluxo de clientes vazio</td></tr>
                      ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).map(client => (
                        <tr key={client.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={\`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 transition-all \${client.logoUrl ? "bg-white border border-slate-100" : "bg-slate-100"}\`}>
                                {client.logoUrl ? (
                                  <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                ) : (
                                  <TrendingUp className="text-slate-300" size={20} />
                                )}
                              </div>
                              <div>
                                <span className="text-lg font-bold text-slate-900 block leading-tight tracking-tight group-hover:text-brand-600 transition-colors uppercase">{client.name}</span>
                                <span className="text-[10px] font-medium text-slate-300 block font-mono mt-1 group-hover:text-slate-400 transition-colors">{client.websiteUrl || 'Sem domínio associado'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            {client.uid ? (
                              <div className="inline-flex items-center gap-2 text-emerald-500 bg-emerald-50 border border-emerald-100/50 rounded-lg px-3 py-1.5 hover:scale-105 transition-transform duration-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm"></div>
                                <span className="text-[8px] font-bold uppercase tracking-wider leading-none">Portal Ativado</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 text-slate-300 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                <span className="text-[8px] font-bold uppercase tracking-wider leading-none">Aguardando</span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-6 text-sm">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Dia {client.billingDay}</span>
                                {(() => {
                                  const status = getPaymentStatus(client);
                                  const Icon = status.icon;
                                  return (
                                    <button 
                                       onClick={() => handleTogglePayment(client)} 
                                       className={\`flex items-center gap-1.5 px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all shadow-sm border \${status.color} hover:shadow-md active:scale-95 \${status.bg}\`}
                                    >
                                       <Icon size={10} /> {status.label}
                                    </button>
                                  );
                                })()}
                              </div>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">{client.packageName || 'Plano Custom'}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                <button
                                  onClick={() => {
                                    setClientForm({ ...client, currentCycleDate: client.currentCycleDate || new Date().toISOString().slice(0, 7), onDemandItems: client.onDemandItems || [] });
                                    setShowClientForm(true);
                                  }}
                                  className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 shadow-sm transition-all active:scale-95"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client)}
                                  className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-rose-500 shadow-sm transition-all active:scale-95"
                                >
                                  <Trash2 size={15} />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-4">
                  {loadingClients ? (
                     Array.from({ length: 3 }).map((_, i) => (
                       <div key={\`skel-cl-mob-\${i}\`} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                         <div className="flex items-center gap-4">
                           <Skeleton variant="circular" className="w-12 h-12" />
                           <div className="flex-1 space-y-2">
                             <Skeleton variant="rectangular" className="h-5 w-3/4" />
                             <Skeleton variant="text" className="w-1/2" />
                           </div>
                         </div>
                       </div>
                     ))
                  ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).length === 0 ? (
                    <div className="p-12 text-center text-slate-300 uppercase text-[10px] font-bold tracking-widest bg-slate-50 rounded-3xl border border-dashed border-slate-200">Sem clientes ativos</div>
                  ) : clients.filter(c => !selectedHubClient || c.name === selectedHubClient).map(client => (
                    <div key={client.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                          <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden border \${client.logoUrl ? "bg-white border-slate-100" : "bg-slate-50 border-transparent"}\`}>
                            {client.logoUrl ? <img src={client.logoUrl} className="w-full h-full object-contain" /> : <TrendingUp size={20} className="text-slate-200" />}
                          </div>
                          <div className="flex-1">
                             <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{client.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest truncate">{client.packageName || 'Plano Custom'}</p>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => { setClientForm({ ...client, currentCycleDate: client.currentCycleDate || new Date().toISOString().slice(0, 7), onDemandItems: client.onDemandItems || [] }); setShowClientForm(true); }} className="p-3 bg-slate-50 text-slate-400 rounded-xl"><Edit3 size={16} /></button>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                             <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-1">Status Portal</p>
                             {client.uid ? (
                               <span className="text-[9px] font-black text-emerald-500 uppercase">Ativado</span>
                             ) : (
                               <span className="text-[9px] font-black text-slate-300 uppercase italic">Aguardando</span>
                             )}
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                             <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-1">Pagamento</p>
                             {(() => {
                               const status = getPaymentStatus(client);
                               return <span className={\`text-[9px] font-black uppercase \${status.color.split(' ')[1]}\`}>{status.label}</span>
                             })()}
                          </div>
                       </div>
                       
                       <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl text-white">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Faturamento</span>
                             <span className="text-xs font-bold uppercase tracking-tighter">Todo dia {client.billingDay}</span>
                          </div>
                          <button onClick={() => navigate('/portal-cliente')} className="bg-white/10 hover:bg-white/20 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all">Ver Visualização</button>
                       </div>
                    </div>
                  ))}
                </div>`;

const newContent2 = content.replace(clientsTableMatch, clientsTableReplacement);
if (newContent2 !== content) {
    console.log('Clients table replaced.');
    content = newContent2;
}

fs.writeFileSync(filePath, content);
