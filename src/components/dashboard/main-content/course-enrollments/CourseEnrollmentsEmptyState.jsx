import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { Link } from 'react-router-dom';

import {
  useEnterpriseCustomer,
  useCanOnlyViewHighlights,
} from '../../../app/data';
import CourseRecommendations from '../CourseRecommendations';

const CourseEnrollmentsEmptyState = () => {
  const { data: enterpriseCustomer } = useEnterpriseCustomer();
  const { data: canOnlyViewHighlightSets } = useCanOnlyViewHighlights();
  if (enterpriseCustomer.disableSearch) {
    return (
      <p>
        <FormattedMessage
          id="enterprise.dashboard.tab.courses.no.enrollments"
          defaultMessage="You are not enrolled in any courses sponsored by {enterpriseName}. Reach out to your administrator for instructions on how to start learning with edX!"
          description="Message shown to a learner on enterprise dashboard when there are no enrollments."
          values={{
            enterpriseName: enterpriseCustomer.name,
          }}
        />
      </p>
    );
  }
  return (
    <>
      <p>
        <FormattedMessage
          id="enterprise.dashboard.tab.courses.default.message"
          defaultMessage="Getting started with edX is easy. Simply find a course from your catalog, request enrollment, and get started on your learning journey."
          description="Default message shown to a learner on enterprise dashboard."
        />
      </p>
      <Button
        as={Link}
        to={`/${enterpriseCustomer.slug}/search`}
        className="btn-brand-primary d-block d-md-inline-block"
      >
        <FormattedMessage
          id="enterprise.dashboard.tab.courses.find.course"
          defaultMessage="Find a course"
          description="Label for Find a course button on enterprise dashboard's courses tab."
        />
      </Button>

      <br />
      {canOnlyViewHighlightSets === false && <CourseRecommendations />}
    </>
  );
};

export default CourseEnrollmentsEmptyState;
