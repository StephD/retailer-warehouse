
import { Layout, PageHeader, PageContent } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";

const Locations = () => {
  return (
    <Layout>
      <PageHeader 
        title="Locations"
        description="Manage your store and warehouse locations"
      />
      
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your location management will appear here. This feature is coming soon.
            </p>
          </CardContent>
        </Card>
      </PageContent>
    </Layout>
  );
};

export default Locations;
