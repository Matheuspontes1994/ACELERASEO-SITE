const fs = require('fs');

const content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

const startIndex = content.indexOf(") : activeTab === 'Planejamento' ? (");
const endIndex = content.indexOf(") : activeTab === 'Pagamentos e Ciclos' ? (");

if (startIndex !== -1 && endIndex !== -1) {
  const newText = `) : activeTab === 'Conteúdo Interno (Acelera)' ? (
          <ContentAgency 
             blogPosts={blogPosts} 
             backlinks={backlinks} 
             setPostForm={setPostForm} 
             setShowPostForm={setShowPostForm}
             setBacklinkForm={setBacklinkForm}
             setShowBacklinkForm={setShowBacklinkForm}
             handleDeletePost={handleDeletePost}
             handleDeleteBacklink={handleDeleteBacklink}
             loadBlogPosts={loadBlogPosts}
             loadBacklinks={loadBacklinks}
             showPostForm={showPostForm}
             postForm={postForm}
             handleSavePost={handleSavePost}
             handleSaveDraft={handleSaveDraft}
             showBacklinkForm={showBacklinkForm}
             backlinkForm={backlinkForm}
             handleSaveBacklink={handleSaveBacklink}
             clientsList={clientsList}
          />
        ) : activeTab === 'Hub de Clientes' ? (
          <HubClients
             clientsList={clientsList}
             selectedHubClient={selectedHubClient}
             setSelectedHubClient={setSelectedHubClient}
             keywordsUniverse={keywordsUniverse}
             showKeywordForm={showKeywordForm}
             setShowKeywordForm={setShowKeywordForm}
             keywordForm={keywordForm}
             setKeywordForm={setKeywordForm}
             handleSaveKeyword={handleSaveKeyword}
             handleDeleteKeyword={handleDeleteKeyword}
             blogPosts={blogPosts}
             backlinks={backlinks}
             setPostForm={setPostForm}
             setShowPostForm={setShowPostForm}
             setBacklinkForm={setBacklinkForm}
             setShowBacklinkForm={setShowBacklinkForm}
             handleDeletePost={handleDeletePost}
             handleDeleteBacklink={handleDeleteBacklink}
             loadBlogPosts={loadBlogPosts}
             loadBacklinks={loadBacklinks}
             showPostForm={showPostForm}
             postForm={postForm}
             handleSavePost={handleSavePost}
             handleSaveDraft={handleSaveDraft}
             showBacklinkForm={showBacklinkForm}
             backlinkForm={backlinkForm}
             handleSaveBacklink={handleSaveBacklink}
          />
        `;
  
  const replaced = content.substring(0, startIndex) + newText + content.substring(endIndex);
  fs.writeFileSync('src/pages/Dashboard.tsx', replaced);
  console.log('Replaced successfully');
} else {
  console.log('Could not find boundaries');
}
