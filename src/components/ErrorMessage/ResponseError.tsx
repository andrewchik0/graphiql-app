import styles from './ResponseError.module.scss';

interface IgraphqlError {
  message: string;
  locations?: {
    line: string;
    column: string;
  }[];
}

export interface IErrorMessage {
  errors: (IgraphqlError | Error)[];
}
const ResponseError: React.FC<IErrorMessage> = ({ errors }: IErrorMessage) => {
  return (
    <div className={styles.errors}>
      {errors.map((error, index) => {
        return (
          <div className={styles.error} key={`error-${index}`}>
            <h5 className={styles.errorMessage}>{error.message}</h5>

            <div>
              {!(error instanceof Error) &&
                error.locations &&
                error.locations.map((location, index) => {
                  return (
                    <p className={styles.errorLocation} key={`location-${index}`}>
                      line: {location.line}, column: {location.column}
                    </p>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResponseError;
