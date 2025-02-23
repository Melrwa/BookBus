from alembic import op
import sqlalchemy as sa


# Revision identifiers, used by Alembic.
revision = '2af94a15342d'
down_revision = 'baf0d5b9a358'
branch_labels = None
depends_on = None


def upgrade():
    # Add the `seat_numbers` column with a default value
    op.add_column('bookings', sa.Column('seat_numbers', sa.String(length=255), nullable=False, server_default="1"))  # Default value for existing rows
    op.alter_column('bookings', 'seat_numbers', server_default=None)  # Remove the default value after adding the column

    # Add the `is_vip` column with a default value
    op.add_column('bookings', sa.Column('is_vip', sa.Boolean(), nullable=False, server_default="false"))
    op.alter_column('bookings', 'is_vip', server_default=None)  # Remove the default value after adding the column

    # Add the `seats_available` column to the `buses` table
    op.add_column('buses', sa.Column('seats_available', sa.Integer(), nullable=False, server_default="0"))
    op.alter_column('buses', 'seats_available', server_default=None)  # Remove the default value after adding the column


def downgrade():
    # Remove the `seat_numbers` column
    op.drop_column('bookings', 'seat_numbers')

    # Remove the `is_vip` column
    op.drop_column('bookings', 'is_vip')

    # Remove the `seats_available` column
    op.drop_column('buses', 'seats_available')